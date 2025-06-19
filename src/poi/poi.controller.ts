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
import { Public } from "../common/decorators/public.decorator";
import { ParseIntPipe } from "../common/pipes/parse-int/parse-int/.pipe";
import { Protocol } from "../common/decorators/protocol.decorator";
import { CreatePoiDTO } from "./interface/CreatePoiDTO";
import { UpdatePoiDTO } from "./interface/UpdatePoiDTO";
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { ActiveUser } from "../iam/decorators/active-user.decorator";
import { UserPayload } from "../iam/types/UserPayload";

@ApiTags("pois")
@Controller("poi")
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Get("all")
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Req() request: Request,
    @ActiveUser() user: UserPayload | string | number,
  ): Promise<POI[]> {
    return this.poiService.findAll(paginationQuery);
  }

  @Get(":id")
  find(@Param("id", ParseIntPipe) id: number) {
    return this.poiService.find({ id: +id });
  }

  @Post()
  create(@Body() buddy: CreatePoiDTO) {
    return this.poiService.create(buddy);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() buddy: UpdatePoiDTO) {
    return this.poiService.update({ ...buddy, id });
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.poiService.remove([+id]);
  }
}
