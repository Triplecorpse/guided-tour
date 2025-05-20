import { Body, Controller, Post } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { SignUpDTO } from "./dto/sign-up-dto";
import { SignInDTO } from "./dto/sign-in-dto";

@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post("sign-up")
  signUp(@Body() data: SignUpDTO): Promise<boolean> {
    return this.authService.signUp(data);
  }

  @Post("sign-in")
  signIn(@Body() data: SignInDTO): Promise<boolean> {
    return this.authService.signIn(data);
  }
}
