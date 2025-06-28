import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception/http-exception.filter";
import { WrapResponseInterceptor } from "./common/interceptors/wrap-response/wrap-response.interceptor";
import { TimeoutInterceptor } from "./common/interceptors/timeout/timeout.interceptor";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AuthExceptionFilter } from "./auth-exception/auth-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(), new AuthExceptionFilter());
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: ["http://localhost:3001"],
  });

  const options = new DocumentBuilder()
    .setTitle("Guided Tours")
    .setDescription("Guided Tours for tourists")
    .setVersion("0.0.1")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
