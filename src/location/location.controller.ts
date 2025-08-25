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
import { Permissions } from "../iam/decorators/permissions.decorator";
import { Permission } from "../iam/enums/permission.enum";

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
  @Permissions(Permission.READ_LOCATION)
  findAll(@Query() paginationQuery: PaginationQueryDto): Promise<Location[]> {
    return this.locationService.findAll(paginationQuery);
  }

  @Get(":id")
  @Permissions(Permission.READ_LOCATION)
  find(@Param("id", ParseIntPipe) id: number) {
    return this.locationService.find({ id: +id });
  }

  @Post()
  @Permissions(Permission.CREATE_LOCATION)
  create(@Body() location: CreateLocationDTO) {
    return this.locationService.create(location);
  }

  @Patch(":id")
  @Permissions(Permission.UPDATE_LOCATION)
  update(@Param("id") id: number, @Body() location: UpdateLocationDTO) {
    return this.locationService.update({ ...location, id });
  }

  @Delete(":id")
  @Permissions(Permission.DELETE_LOCATION)
  remove(@Param("id") id: string) {
    return this.locationService.remove([+id]);
  }
}
