import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Permission } from "./interface/Permission";

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(permission: Partial<Permission>): Promise<Permission> {
    const newPermission = this.permissionRepository.create(permission);
    return await this.permissionRepository.save(newPermission);
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async findOne(id: number): Promise<Permission> {
    return await this.permissionRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    permission: Partial<Permission>,
  ): Promise<Permission> {
    await this.permissionRepository.update(id, permission);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.permissionRepository.delete(id);
  }
}
