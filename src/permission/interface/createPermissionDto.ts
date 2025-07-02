import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  createUser: boolean;

  @IsBoolean()
  readUser: boolean;

  @IsBoolean()
  updateUser: boolean;

  @IsBoolean()
  deleteUser: boolean;

  @IsBoolean()
  createPoi: boolean;

  @IsBoolean()
  readPoi: boolean;

  @IsBoolean()
  updatePoi: boolean;

  @IsBoolean()
  deletePoi: boolean;

  @IsBoolean()
  createLocation: boolean;

  @IsBoolean()
  readLocation: boolean;

  @IsBoolean()
  updateLocation: boolean;

  @IsBoolean()
  deleteLocation: boolean;
}
