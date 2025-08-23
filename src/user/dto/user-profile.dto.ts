import { ApiProperty } from "@nestjs/swagger";
import { Permission } from "../../permission/interface/Permission";

export class UserProfileDto {
  @ApiProperty({ example: 1, description: "User ID" })
  id: number;

  @ApiProperty({ example: "user@example.com", description: "User email" })
  email: string;

  @ApiProperty({
    example: false,
    description: "Password set status.",
  })
  isPasswordSet: boolean;

  @ApiProperty({
    example: false,
    description: "Google authentication enabled status",
  })
  isGoogleAuthenticationEnabled: boolean;

  @ApiProperty({ example: "John Doe", description: "User full name" })
  full_name: string;

  @ApiProperty({
    example: false,
    description: "Two-factor authentication status",
  })
  isTFAEnabled: boolean;

  @ApiProperty({ description: "User role and permissions" })
  role: Permission;
}
