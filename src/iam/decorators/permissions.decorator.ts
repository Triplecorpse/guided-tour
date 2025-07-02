import { PermissionType } from "../authorization/permission.type";
import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY = "permissions";
export const Permissions = (...permissions: PermissionType[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
