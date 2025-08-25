import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserPayload } from "../../../types/UserPayload";
import { REQUEST_USER_KEY } from "../../../iam.constants";
import { PERMISSIONS_KEY } from "../../../decorators/permissions.decorator";
import { Permission } from "../../../enums/permission.enum";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permission = this.reflector.getAllAndOverride<Permission>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permission) {
      return true;
    }

    const user: UserPayload = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ] as UserPayload;

    return Boolean(user.permissions && user.permissions[permission]);
  }
}
