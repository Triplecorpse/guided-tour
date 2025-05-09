import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { POI } from "../poi/POI";

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => POI, (poi) => poi.location)
  pois: POI[];
}
