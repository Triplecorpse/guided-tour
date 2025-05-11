import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { PoiService } from "./poi.service";
import { CreatePoiDTO, POI, UpdatePoiDTO } from "./POI";
import { PaginationQueryDto } from "../common/pagination-query.dto/pagination-query.dto";

@Controller("poi")
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Get("all")
  findAll(@Query() paginationQuery: PaginationQueryDto): Promise<POI[]> {
    return this.poiService.findAll(paginationQuery);
  }

  @Get(":id")
  find(@Param("id") id: number) {
    return this.poiService.find({ id: +id });
  }

  @Post()
  create(@Body() buddy: CreatePoiDTO) {
    return this.poiService.create(buddy);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() buddy: UpdatePoiDTO) {
    return this.poiService.update(buddy);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.poiService.remove([+id]);
  }
}
