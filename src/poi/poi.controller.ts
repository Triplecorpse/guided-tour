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
import { PoiService } from "./poi.service";
import { POI } from "./interface/POI";
import { PaginationQueryDto } from "../common/pagination-query.dto/pagination-query.dto";
import { ParseIntPipe } from "../common/pipes/parse-int/parse-int/.pipe";
import { CreatePoiDTO } from "./interface/CreatePoiDTO";
import { UpdatePoiDTO } from "./interface/UpdatePoiDTO";
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { ActiveUser } from "../iam/decorators/active-user.decorator";
import { UserPayload } from "../iam/types/UserPayload";
import { Permissions } from "../iam/decorators/permissions.decorator";
import { Role } from "../iam/enums/role.enum";
import { Permission } from "../iam/enums/permission.enum";

@ApiTags("pois")
@Controller("poi")
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Get("all")
  @Permissions(Permission.READ_POI)
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Req() request: Request,
    @ActiveUser() user: UserPayload | string | number,
  ): Promise<POI[]> {
    return this.poiService.findAll(paginationQuery);
  }

  @Get(":id")
  @Permissions(Permission.READ_POI)
  find(@Param("id", ParseIntPipe) id: number) {
    return this.poiService.find({ id: +id });
  }

  @Post()
  @Permissions(Permission.CREATE_POI)
  create(@Body() buddy: CreatePoiDTO) {
    return this.poiService.create(buddy);
  }

  @Patch(":id")
  @Permissions(Permission.UPDATE_POI)
  update(@Param("id") id: number, @Body() buddy: UpdatePoiDTO) {
    return this.poiService.update({ ...buddy, id });
  }

  @Permissions(Permission.DELETE_POI)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.poiService.remove([+id]);
  }
}
