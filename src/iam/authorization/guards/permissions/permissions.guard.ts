import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserPayload } from "../../../types/UserPayload";
import { REQUEST_USER_KEY } from "../../../iam.constants";
import { PERMISSIONS_KEY } from "../../../decorators/permissions.decorator";
import { PermissionType } from "../../permission.type";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!contextPermissions) {
      return true;
    }

    const user: UserPayload = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];

    return contextPermissions.every((permission) =>
      user?.permissions ? user.permissions[permission] === true : false,
    );
  }
}
