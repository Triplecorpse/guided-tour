import { IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateLocationDTO, LocationDTO } from "../../location/location";
import { GeoPointDTO } from "./GeoPointDTO";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePoiDTO {
  @ApiProperty({ description: "Name of POI" })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: "Type of POI (Museum, Park, Mountain etc)" })
  @IsString()
  readonly type: string;

  @ApiProperty({ description: "Coordinated of POI in designated format" })
  @IsObject()
  @ValidateNested()
  @Type(() => GeoPointDTO)
  point: GeoPointDTO;

  @ApiProperty({ description: "A region which the POI is in" })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDTO)
  location: CreateLocationDTO;
}
