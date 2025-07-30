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

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauth2Client: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  onModuleInit() {
    const clientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
    const clientSecret = this.configService.get<string>("GOOGLE_CLIENT_SECRET");
    this.oauth2Client = new OAuth2Client(clientId, clientSecret);
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
        return this.authService.generateTokens(user);
      } else {
        const newUser = await this.userRepository.save({ email, googleId });
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
}
