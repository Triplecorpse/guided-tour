import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  createUser: boolean;

  @Column({ default: false })
  readUser: boolean;

  @Column({ default: false })
  updateUser: boolean;

  @Column({ default: false })
  deleteUser: boolean;

  @Column({ default: false })
  createPoi: boolean;

  @Column({ default: false })
  readPoi: boolean;

  @Column({ default: false })
  updatePoi: boolean;

  @Column({ default: false })
  deletePoi: boolean;

  @Column({ default: false })
  createLocation: boolean;

  @Column({ default: false })
  readLocation: boolean;

  @Column({ default: false })
  updateLocation: boolean;

  @Column({ default: false })
  deleteLocation: boolean;
}
