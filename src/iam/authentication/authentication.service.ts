import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../User";
import { Repository } from "typeorm";
import { HashingService } from "../hashing.service";
import { SignUpDTO } from "./dto/sign-up-dto";
import { SignInDTO } from "./dto/sign-in-dto";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";
import { JwtService } from "@nestjs/jwt";
import { AuthErrorType } from "./enums/auth-error.enum";
import { AuthException } from "../../auth-exception/AuthException";
import { UserPayload } from "../types/UserPayload";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { randomUUID } from "crypto";
import { RefreshTokenIdsStorage } from "./refresh-token-ids.storage/refresh-token-ids.storage";

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIds: RefreshTokenIdsStorage,
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
        throw new AuthException(
          AuthErrorType.UNIQUE_VIOLATION,
          { email: dto.email },
          409,
          e.detail,
        );
      }
      throw e;
    }
  }

  async signIn(
    dto: SignInDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) {
      throw new AuthException(
        AuthErrorType.USER_NOT_FOUND,
        { email: dto.email },
        401,
      );
    }
    const isEqual = await this.hashingService.compare(
      dto.password,
      user.password,
    );
    if (!isEqual) {
      throw new AuthException(
        AuthErrorType.PASSWORD_MISMATCH,
        { password: "" },
        401,
      );
    }
    return await this.generateTokens(user);
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken]: [string, string] = await Promise.all([
      this.signToken<Partial<UserPayload>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email, role: user.role },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIds.insert(
      user.id,
      refreshTokenId,
      this.jwtConfiguration.refreshTokenTtl,
    );
    return { accessToken, refreshToken };
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
    return accessToken;
  }

  async refreshTokens(data: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<UserPayload, "sub"> & { refreshTokenId: string }
      >(data.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.userRepository.findOneByOrFail({ id: sub });
      const isValid = await this.refreshTokenIds.validate(sub!, refreshTokenId);
      if (!isValid) {
        throw new Error("Refresh token is invalid");
      }
      await this.refreshTokenIds.invalidate(sub!);
      return this.generateTokens(user);
    } catch (error) {
      throw new AuthException(
        AuthErrorType.INVALID_CREDENTIALS,
        { refreshToken: data.refreshToken },
        401,
      );
    }
  }

  async getUserById(accessToken: string): Promise<User | null> {
    const payload = await this.jwtService.verifyAsync<Pick<UserPayload, "sub">>(
      accessToken,
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      },
    );
    const id = payload.sub;
    return this.userRepository.findOneBy({ id });
  }
}
