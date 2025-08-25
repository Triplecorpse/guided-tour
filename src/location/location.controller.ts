import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { LocationService } from "./location.service";
import { Location } from "./location";
import { PaginationQueryDto } from "../common/pagination-query.dto/pagination-query.dto";
import { ParseIntPipe } from "../common/pipes/parse-int/parse-int/.pipe";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { ActiveUser } from "../iam/decorators/active-user.decorator";
import { UserPayload } from "../iam/types/UserPayload";
import { Roles } from "../iam/decorators/roles.decorator";
import { Role } from "../iam/enums/role.enum";

export interface CreateLocationDTO {
  name: string;
  parentId?: number;
}

export interface UpdateLocationDTO {
  id?: number;
  name?: string;
  parentId?: number;
}

@ApiTags("locations")
@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get("all")
  findAll(@Query() paginationQuery: PaginationQueryDto): Promise<Location[]> {
    return this.locationService.findAll(paginationQuery);
  }

  @Get(":id")
  find(@Param("id", ParseIntPipe) id: number) {
    return this.locationService.find({ id: +id });
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() location: CreateLocationDTO) {
    return this.locationService.create(location);
  }

  @Roles(Role.Admin)
  @Patch(":id")
  update(@Param("id") id: number, @Body() location: UpdateLocationDTO) {
    return this.locationService.update({ ...location, id });
  }

  @Roles(Role.Admin)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.locationService.remove([+id]);
  }
}
