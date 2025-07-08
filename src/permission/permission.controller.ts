import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from "@nestjs/common";
import { Permission } from "./interface/Permission";
import { PermissionService } from "./permission.service";
import { CreatePermissionDto } from "./interface/createPermissionDto";
import { UpdatePermissionDto } from "./interface/updatePermissionDto";

@Controller("permissions")
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  async findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<Permission | null> {
    return this.permissionService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() permission: UpdatePermissionDto,
  ): Promise<Permission | null> {
    return this.permissionService.update(id, permission);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<void> {
    return this.permissionService.remove(id);
  }
}
