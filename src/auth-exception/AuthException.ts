import { HttpException, HttpStatus } from "@nestjs/common";
import { AuthErrorType } from "../iam/authentication/enums/auth-error.enum";

export interface AuthErrorResponse {
  message: AuthErrorType;
  data?: Record<string, any>;
  error?: string;
  statusCode: number;
  timestamp: string;
  originalMessage?: string;
}

export class AuthException extends HttpException {
  constructor(
    type: AuthErrorType,
    data: Record<string, any> = {},
    status: number = HttpStatus.UNAUTHORIZED,
    originalMessage: string = "",
  ) {
    const response: AuthErrorResponse = {
      message: type,
      data,
      statusCode: status || 400,
      error: "Authentication Error",
      originalMessage,
      timestamp: new Date().toISOString(),
    };
    super(response, response.statusCode);
  }
}
