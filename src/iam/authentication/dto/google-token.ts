import { IsOptional, IsString } from "class-validator";

export class GoogleTokenDto {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  code?: string;
}
