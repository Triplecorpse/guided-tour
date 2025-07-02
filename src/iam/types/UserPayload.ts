import { PermissionType } from "../authorization/permission.type";

export interface UserPayload {
  sub?: number;
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
  aud?: string;
  iss?: string;
  role?: string;
  permissions?: PermissionType[];
}
