import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  createUser?: boolean;

  @IsOptional()
  @IsBoolean()
  readUser?: boolean;

  @IsOptional()
  @IsBoolean()
  updateUser?: boolean;

  @IsOptional()
  @IsBoolean()
  deleteUser?: boolean;

  @IsOptional()
  @IsBoolean()
  createPoi?: boolean;

  @IsOptional()
  @IsBoolean()
  readPoi?: boolean;

  @IsOptional()
  @IsBoolean()
  updatePoi?: boolean;

  @IsOptional()
  @IsBoolean()
  deletePoi?: boolean;

  @IsOptional()
  @IsBoolean()
  createLocation?: boolean;

  @IsOptional()
  @IsBoolean()
  readLocation?: boolean;

  @IsOptional()
  @IsBoolean()
  updateLocation?: boolean;

  @IsOptional()
  @IsBoolean()
  deleteLocation?: boolean;
}
