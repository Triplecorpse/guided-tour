import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { PoiService } from "./poi.service";
import { CreatePoiDTO, UpdatePoiDTO } from "./POI";

@Controller("poi")
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Get("all")
  findAll() {
    return this.poiService.findAll();
  }

  @Get(":id")
  find(@Param("id") id: number) {
    return this.poiService.find({ id: +id });
  }

  @Post()
  create(@Body() buddy: CreatePoiDTO) {
    console.log(buddy);
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
