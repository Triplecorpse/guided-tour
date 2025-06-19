import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../User";
import { Repository } from "typeorm";
import { HashingService } from "../hashing.service";
import { SignUpDTO } from "./dto/sign-up-dto";
import { SignInDTO } from "./dto/sign-in-dto";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(dto: SignUpDTO): Promise<boolean> {
    try {
      const user = new User();
      user.email = dto.email;
      user.full_name = dto.full_name;
      user.password = await this.hashingService.hash(dto.password);

      await this.userRepository.save(user);
      return true;
    } catch (e) {
      const pgUniqueViolationErrorCode = "23505";
      if (e.code === pgUniqueViolationErrorCode) {
        throw new ConflictException(e.detail);
      }
      throw e;
    }
  }

  async signIn(dto: SignInDTO): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException("User does not exist");
    }
    const isEqual = await this.hashingService.compare(
      dto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException("Password not match");
    }
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
    return { accessToken };
  }
}
