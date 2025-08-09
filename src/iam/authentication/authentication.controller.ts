import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { SignUpDTO } from "./dto/sign-up-dto";
import { SignInDTO } from "./dto/sign-in-dto";
import { Request, Response } from "express";
import { Auth } from "./decorators/auth.decorator";
import { AuthType } from "./enums/auth-type.enum";
import { Public } from "src/common/decorators/public.decorator";
import { ActiveUser } from "../decorators/active-user.decorator";
import { UserPayload } from "../types/UserPayload";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { OtpAuthenticationService } from "./otp-authentication.service";
import { toFileStream } from "qrcode";

@Auth(AuthType.None)
@Controller("authentication")
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly otpAuthenticationService: OtpAuthenticationService,
  ) {}

  @Public()
  @Post("sign-up")
  signUp(@Body() data: SignUpDTO): Promise<boolean> {
    return this.authService.signUp(data);
  }

  @Public()
  @Post("sign-in")
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() data: SignInDTO,
  ): Promise<{ isTFARequired: boolean }> {
    const { accessToken, refreshToken, isTFARequired } =
      await this.authService.signIn(data);

    response.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    response.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });

    return { isTFARequired };
  }

  @Public()
  @Post("refresh-tokens")
  async refreshTokens(
    @Res({ passthrough: true }) response: Response,
    @Body() data: RefreshTokenDto,
  ) {
    const tokens = await this.authService.refreshTokens(data);
    response.cookie("accessToken", tokens.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    response.cookie("refreshToken", tokens.refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return tokens;
  }

  @Public()
  @Get("check")
  async check(
    @ActiveUser() user: UserPayload,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<{ isAuthenticated: boolean; user?: UserPayload }> {
    const refreshToken: string | undefined = request.cookies.refreshToken as
      | string
      | undefined;
    if (!user && refreshToken) {
      const tokens = await this.authService.refreshTokens({ refreshToken });
      response.cookie("accessToken", tokens.accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
      response.cookie("refreshToken", tokens.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });

      const user = await this.authService.getUserByToken(tokens.accessToken);
      return {
        isAuthenticated: !!user,
        user: { name: user?.full_name, sub: user?.id, email: user?.email },
      };
    }

    return {
      isAuthenticated: !!user,
      user: { name: user?.name, email: user?.email, sub: user?.sub },
    };
  }

  @Get("sign-out")
  logout(@Res({ passthrough: true }) response: Response): null {
    response.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    });
    response.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

    return null;
  }

  @Post("2fa/generate-secret")
  async generateQRCode(
    @ActiveUser() activeUser: UserPayload,
    @Res() response: Response,
  ) {
    const { uri, secret } = this.otpAuthenticationService.generateSecret(
      activeUser.email!,
    );
    await this.otpAuthenticationService.enableTFAForUser(
      activeUser.email!,
      secret,
    );
    response.type("image/png");
    return toFileStream(response, uri);
  }

  @Post("2fa/verify")
  async verifyCode(
    @ActiveUser() activeUser: UserPayload,
    @Req() request: Request,
    @Res() response: Response,
    @Body() { code }: { code: string },
  ): Promise<{ isValid: boolean }> {
    try {
      const user = await this.authService.getUserByEmail(activeUser.email!);
      const isValid = this.otpAuthenticationService.verifyCode(
        code,
        user.TFASecret,
      );
      if (!isValid) {
        throw new UnauthorizedException("Invalid 2FA code");
      }

      const { accessToken, refreshToken } =
        await this.authService.generateTokens(user, {
          isTFAAuthorised: true,
        });
      response.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
      response.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });

      return { isValid: true };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Unable to verify 2FA code");
    }
  }
}
