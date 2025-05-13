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
import { Public } from "../common/decorators/public.decorator";
import { ParseIntPipe } from "../common/pipes/parse-int/parse-int/.pipe";
import { Protocol } from "../common/decorators/protocol.decorator";

@Controller("poi")
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Public()
  @Get("all")
  findAll(
    @Protocol("https") protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<POI[]> {
    console.log(protocol);
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
  update(@Param("id") id: string, @Body() buddy: UpdatePoiDTO) {
    return this.poiService.update(buddy);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.poiService.remove([+id]);
  }
}
