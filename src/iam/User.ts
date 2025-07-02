import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Role } from "./enums/role.enum";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  full_name: string;

  @Column({ enum: Role, default: Role.Regular })
  role: Role;
}
