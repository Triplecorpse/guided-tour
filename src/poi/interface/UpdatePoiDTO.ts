import { IsObject, IsOptional, ValidateNested } from "class-validator";
import { CreatePoiDTO } from "./CreatePoiDTO";
import { GeoPointDTO } from "./GeoPointDTO";
import { PartialType } from "@nestjs/swagger";

export class UpdatePoiDTO extends PartialType(CreatePoiDTO) {
  readonly id: number;

  readonly name?: string;

  readonly type?: string;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  readonly point?: GeoPointDTO;
}
