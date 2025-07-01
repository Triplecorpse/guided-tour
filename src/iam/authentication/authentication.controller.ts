import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
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

@Auth(AuthType.None)
@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

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
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { accessToken, refreshToken } = await this.authService.signIn(data);
    response.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    response.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return { accessToken, refreshToken };
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
        sameSite: true,
      });
      response.cookie("refreshToken", tokens.refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: true,
      });

      const user = await this.authService.getUserById(tokens.accessToken);
      return {
        isAuthenticated: !!user,
        user: { name: user?.full_name, sub: user?.id, email: user?.email },
      };
    }

    return {
      isAuthenticated: !!user,
      user: { name: user.name, email: user.email, sub: user.sub },
    };
  }
}
