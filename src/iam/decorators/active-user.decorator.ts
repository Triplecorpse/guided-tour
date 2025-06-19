import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { REQUEST_USER_KEY } from "../iam.constants";
import { UserPayload } from "../types/UserPayload";

export const ActiveUser = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext): unknown => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: UserPayload = request[REQUEST_USER_KEY] as UserPayload;
    return field ? user?.[field] : user;
  },
);
