import { Body, Controller, Post } from "@nestjs/common";
import { GoogleAuthenticationService } from "./google-authentication.service";
import { GoogleTokenDto } from "../dto/google-token";
import { Public } from "src/common/decorators/public.decorator";

@Public()
@Controller("authentication/google")
export class GoogleAuthenticationController {
  constructor(
    private googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  authenticate(@Body() tokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(tokenDto.token);
  }
}
