import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  Point,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Location } from "../../location/location";

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
