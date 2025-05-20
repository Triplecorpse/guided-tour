import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignUpDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  password: string;
}
