import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthenticationService } from "../authentication.service";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../User";
import { Repository } from "typeorm";
import { OAuth2Client } from "google-auth-library";
import { AppSettings } from "../../../app-settings/interface/AppSettings";
import { Permission } from "../../../permission/interface/Permission";

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauth2Client: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(AppSettings)
    private readonly appSettingsRepository: Repository<AppSettings>,
  ) {}

  onModuleInit() {
    const clientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
    const clientSecret = this.configService.get<string>("GOOGLE_CLIENT_SECRET");
    const redirectUri = this.configService.get<string>("GOOGLE_CLIENT_SECRET");
    this.oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
  }

  async authenticate(token: string) {
    try {
      const loginTicket = await this.oauth2Client.verifyIdToken({
        idToken: token,
      });
      const payload = loginTicket.getPayload();
      const email = payload?.email;
      const googleId = payload?.sub;
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (user) {
        return this.authService.generateTokens(user, { isTFAAuthorised: true });
      } else {
        const defaultRoleSetting = await this.appSettingsRepository.findOne({
          where: { key: "default_role" },
        });
        if (!defaultRoleSetting) {
          throw new UnauthorizedException(
            "Default role setting not found. Please contact support.",
          );
        }
        const newUser = await this.userRepository.save({
          email,
          googleId,
          full_name: payload?.name,
          role: { id: +defaultRoleSetting.value } as Partial<Permission>,
        });
        return this.authService.generateTokens(newUser);
      }
    } catch (error) {
      const pgUniqueViolationError = "23505";
      if (error.code === pgUniqueViolationError) {
        throw new ConflictException();
      } else {
        throw new UnauthorizedException();
      }
    }
  }

  async handleGoogleRedirect(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      if (tokens.id_token) {
        return this.authenticate(tokens.id_token);
      } else {
        throw new UnauthorizedException("Invalid Google token");
      }
    } catch (error) {
      console.log(error.response?.data);

      throw new Error(error.response?.data ?? "Invalid Google token");
    }
  }
}
