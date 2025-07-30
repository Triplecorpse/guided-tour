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

  @Column({ nullable: true })
  password: string;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  googleId: string;

  @ManyToOne(() => Permission, { nullable: false })
  @JoinColumn({ name: "roleId" })
  role: Permission;
}
