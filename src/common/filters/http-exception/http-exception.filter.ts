import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    console.log(exception);
    console.log(host);
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const status: number = exception.getStatus();
    const exceptionResponse: string | object = exception.getResponse();
    const error: Record<string, any> =
      typeof exceptionResponse === "string"
        ? { message: exceptionResponse }
        : exceptionResponse;

    response
      .status(status)
      .json({ ...error, timestamp: new Date().toISOString() });
  }
}
