import { Body, Controller, Post } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { SignUpDTO } from "./dto/sign-up-dto";
import { SignInDTO } from "./dto/sign-in-dto";
import { Public } from "../../common/decorators/public.decorator";

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
  signIn(@Body() data: SignInDTO): Promise<boolean> {
    return this.authService.signIn(data);
  }
}
