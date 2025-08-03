import { Module } from "@nestjs/common";
import { HashingService } from "./hashing.service";
import { BcryptService } from "./bcrypt.service";
import { AuthenticationController } from "./authentication/authentication.controller";
import { AuthenticationService } from "./authentication/authentication.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./User";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "./config/jwt.config";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { AuthenticationGuard } from "./authentication/guards/authentication/authentication.guard";
import { AccessTokenGuard } from "./authentication/guards/access-token/access-token.guard";
import { RefreshTokenIdsStorage } from "./authentication/refresh-token-ids.storage/refresh-token-ids.storage";
import { PermissionsGuard } from "./authorization/guards/permissions/permissions.guard";
import { Permission } from "../permission/interface/Permission";
import { AppSettingsModule } from "../app-settings/app-settings.module";
import { GoogleAuthenticationController } from "./authentication/social/google-authentication.controller";
import { GoogleAuthenticationService } from "./authentication/social/google-authentication.service";
import { AppSettings } from "../app-settings/interface/AppSettings";
import { OtpAuthenticationService } from "./authentication/otp-authentication.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Permission, AppSettings]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    AppSettingsModule,
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
    GoogleAuthenticationService,
    OtpAuthenticationService,
  ],
  controllers: [AuthenticationController, GoogleAuthenticationController],
})
export class IamModule {}
