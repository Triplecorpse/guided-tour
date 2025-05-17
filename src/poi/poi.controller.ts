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
import { POI } from "./interface/POI";
import { PaginationQueryDto } from "../common/pagination-query.dto/pagination-query.dto";
import { Public } from "../common/decorators/public.decorator";
import { ParseIntPipe } from "../common/pipes/parse-int/parse-int/.pipe";
import { Protocol } from "../common/decorators/protocol.decorator";
import { CreatePoiDTO } from "./interface/CreatePoiDTO";
import { UpdatePoiDTO } from "./interface/UpdatePoiDTO";
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("pois")
@Controller("poi")
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @ApiOkResponse({ type: CreatePoiDTO })
  @ApiForbiddenResponse({ description: "Forbidden" })
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
  update(@Param("id") id: number, @Body() buddy: UpdatePoiDTO) {
    return this.poiService.update({ ...buddy, id });
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.poiService.remove([+id]);
  }
}
