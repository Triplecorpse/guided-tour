import { Module } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { PermissionController } from "./permission.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "./interface/Permission";

@Module({
  providers: [PermissionService],
  controllers: [PermissionController],
  imports: [TypeOrmModule.forFeature([Permission])],
})
export class PermissionModule {}
