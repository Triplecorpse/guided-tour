import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { POI } from "../poi/POI";
import { IsNumber, IsOptional, IsString } from "class-validator";

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
  parent: Location;

  @OneToMany(() => Location, (location) => location.parent)
  children: Location[];
}

export abstract class LocationDTO {
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @IsString()
  readonly name?: string;
}

export class UpdateLocationDTO extends LocationDTO {
  @IsNumber()
  declare readonly id: number;

  @IsString()
  declare readonly name?: string;
}

export class CreateLocationDTO extends LocationDTO {
  @IsString()
  declare readonly name: string;
}
