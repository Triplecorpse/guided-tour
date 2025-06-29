import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import { AuthErrorType } from "../iam/authentication/enums/auth-error.enum";

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // Handle PostgreSQL unique violation
    if (status === 409 && typeof exceptionResponse === "string") {
      const matches = exceptionResponse.match(/Key \((.*?)\)=\((.*?)\)/);
      if (matches) {
        const [, field, value] = matches;
        return response.status(status).json({
          message: AuthErrorType.UNIQUE_VIOLATION,
          data: { [field]: value },
          error: "Conflict",
          originalMessage: exceptionResponse,
          statusCode: status,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Handle validation errors
    if (status === 400 && Array.isArray(exceptionResponse.message)) {
      const validationErrors = exceptionResponse.message;
      const processedErrors = this.processValidationErrors(validationErrors);

      return response.status(status).json({
        message: AuthErrorType.VALIDATION_ERROR,
        data: processedErrors,
        error: "Bad Request",
        originalMessage: exceptionResponse.message.join(", "),
        statusCode: status,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle other authentication errors
    const error = {
      message: exceptionResponse.message || "Authentication Error",
      data: exceptionResponse.data || null,
      error: exceptionResponse.error || "Unauthorized",
      originalMessage: exceptionResponse.originalMessage,
      statusCode: status,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(error);
  }

  private processValidationErrors(errors: string[]): Record<string, any> {
    const result: Record<string, any> = {};

    errors.forEach((error) => {
      // Handle password length validation
      if (error.includes("password") && error.includes("shorter")) {
        result.password = {
          type: AuthErrorType.PASSWORD_TOO_SHORT,
          message: "Password must be at least 10 characters long",
        };
      }
      // Handle string validation
      else if (error.includes("must be a string")) {
        const field = error.split(" ")[0];
        result[field] = {
          type: AuthErrorType.INVALID_STRING,
          message: `${field} must be a string`,
        };
      }
      // Add other specific validation cases as needed
      else {
        const field = error.split(" ")[0];
        result[field] = {
          type: AuthErrorType.VALIDATION_ERROR,
          message: error,
        };
      }
    });

    return result;
  }
}
