import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { POI } from "../poi/interface/POI";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => POI, (poi) => poi.location)
  pois: POI[];

  // Self-referencing relationship: Many children to one parent
  @ManyToOne(() => Location, (location) => location.children, {
    nullable: true,
  })
  parent: Location | null;

  @OneToMany(() => Location, (location) => location.parent)
  children: Location[];
}

export abstract class LocationDTO {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @ApiProperty()
  @IsString()
  readonly name?: string;
}

export class UpdateLocationDTO extends LocationDTO {
  @ApiProperty()
  @IsNumber()
  declare readonly id: number;

  @ApiProperty()
  @IsString()
  declare readonly name?: string;
}

export class CreateLocationDTO extends LocationDTO {
  @ApiProperty()
  @IsString()
  declare readonly name: string;
}
