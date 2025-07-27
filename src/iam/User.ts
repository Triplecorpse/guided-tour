import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Permission } from "../permission/interface/Permission";

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

  @ManyToOne(() => Permission, { nullable: false })
  @JoinColumn({ name: "roleId" })
  role: Permission;
}
