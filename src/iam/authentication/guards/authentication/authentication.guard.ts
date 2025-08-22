import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/common/decorators/public.decorator";
import { AccessTokenGuard } from "../access-token/access-token.guard";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "../../../config/jwt.config";
import { UserPayload } from "../../../types/UserPayload";
import { REQUEST_USER_KEY } from "../../../iam.constants";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return await this.accessTokenGuard.canActivate(context);
  }
}
