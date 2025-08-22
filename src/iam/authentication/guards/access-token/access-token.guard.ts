import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../../../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { Request } from "express";
import { REQUEST_USER_KEY } from "../../../iam.constants";
import { UserPayload } from "../../../types/UserPayload";
import { AuthException } from "../../../../auth-exception/AuthException";
import { AuthErrorType } from "../../enums/auth-error.enum";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string | void = request.cookies.accessToken as string | void;

    console.log(token);

    if (!token) {
      throw new AuthException(AuthErrorType.TOKEN_NOT_PROVIDED);
    }

    try {
      const payload: UserPayload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      if (payload.isTFARequired) {
        throw new AuthException(AuthErrorType.TFA_REQUIRED);
      }
      request[REQUEST_USER_KEY] = payload;
    } catch (e) {
      if (e instanceof AuthException) {
        throw e;
      }

      if (e.name === "TokenExpiredError") {
        throw new AuthException(AuthErrorType.TOKEN_EXPIRED);
      }

      throw new AuthException(
        AuthErrorType.TOKEN_NOT_VERIFIED,
        {},
        HttpStatus.UNAUTHORIZED,
        JSON.stringify(e),
      );
    }
    return true;
  }
}
