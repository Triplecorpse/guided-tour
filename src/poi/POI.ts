import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  Point,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  CreateLocationDTO,
  Location,
  LocationDTO,
  UpdateLocationDTO,
} from "../location/location";
import { Type } from "class-transformer";

export class GeoPointDTO {
  @IsIn(["Point"])
  type: "Point";

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates: [number, number];
}

export class CreatePoiDTO {
  @IsString()
  readonly name: string;

  @IsString()
  readonly type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => GeoPointDTO)
  point: GeoPointDTO;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDTO)
  location: CreateLocationDTO | UpdateLocationDTO;
}

export class UpdatePoiDTO extends PartialType(CreatePoiDTO) {
  readonly id: number;
  readonly name?: string;
  readonly type?: string;
  @IsObject()
  @ValidateNested()
  readonly point?: GeoPointDTO;
}

@Entity("pois")
export class POI {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "geometry", spatialFeatureType: "Point", srid: 4326 })
  point: Point;

  @Column()
  name: string;

  @Column()
  type: string;

  @JoinTable()
  @ManyToOne((type) => Location, (location) => location.pois, { cascade: true })
  location: Location;

  @Column({ default: 0 })
  recommendations: number;
}
