import { Permission } from "../../permission/interface/Permission";

export interface UserPayload {
  sub?: number;
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
  aud?: string;
  iss?: string;
  permissions?: Permission;
}
