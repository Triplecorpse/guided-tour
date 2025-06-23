import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { SignUpDTO } from "./dto/sign-up-dto";
import { SignInDTO } from "./dto/sign-in-dto";
import { Response } from "express";
import { Auth } from "./decorators/auth.decorator";
import { AuthType } from "./enums/auth-type.enum";

@Auth(AuthType.None)
@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post("sign-up")
  signUp(@Body() data: SignUpDTO): Promise<boolean> {
    return this.authService.signUp(data);
  }

  @Post("sign-in")
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() data: SignInDTO,
  ): Promise<{ accessToken: string }> {
    const { accessToken } = await this.authService.signIn(data);
    response.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return { accessToken };
  }

  @Get("check")
  check(): Promise<any> {
    return Promise.resolve({});
  }
}
