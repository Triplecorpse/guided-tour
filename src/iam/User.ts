import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from "typeorm";
import { Permission } from "../permission/interface/Permission";

@Entity("users")
@Check(`("isTFAEnabled" = false OR "TFASecret" IS NOT NULL)`)
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

  @Column({ default: false })
  isTFAEnabled: boolean;

  @Column({ nullable: true, unique: true })
  TFASecret: string;

  @ManyToOne(() => Permission, { nullable: false })
  @JoinColumn({ name: "roleId" })
  role: Permission;
}
