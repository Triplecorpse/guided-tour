import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("app_settings")
export class AppSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: false, unique: true })
  key: string;

  @Column({ type: "text" })
  value: string;
}
