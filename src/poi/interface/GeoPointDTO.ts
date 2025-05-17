import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GeoPointDTO {
  @ApiProperty()
  @IsIn(["Point"])
  type: "Point";

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates: [number, number];
}
