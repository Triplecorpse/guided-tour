import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(["name", "type"])
@Entity("events")
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Index()
  @Column()
  name: string;

  @Column("json")
  payload: Record<string, any>;
}
