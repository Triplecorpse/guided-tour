import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from "@nestjs/common";
import { GoogleAuthenticationService } from "./google-authentication.service";
import { GoogleTokenDto } from "../dto/google-token";
import { Response } from "express";
import { Public } from "src/common/decorators/public.decorator";

@Public()
@Controller("authentication/google")
export class GoogleAuthenticationController {
  constructor(
    private googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  async authenticate(
    @Body() tokenDto: GoogleTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    let tokens: {
      accessToken: string;
      refreshToken: string;
    };
    if (tokenDto.token) {
      tokens = await this.googleAuthenticationService.authenticate(
        tokenDto.token,
      );
    } else if (tokenDto.code) {
      tokens = await this.googleAuthenticationService.handleGoogleRedirect(
        tokenDto.code,
      );
    } else {
      return { ok: false };
    }
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
    return {};
  }
}
