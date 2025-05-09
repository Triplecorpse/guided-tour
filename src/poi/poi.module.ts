import { Module } from "@nestjs/common";
import { PoiService } from "./poi.service";
import { PoiController } from "./poi.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { POI } from "./POI";
import { Location } from "../location/location";

@Module({
  providers: [PoiService],
  controllers: [PoiController],
  imports: [TypeOrmModule.forFeature([POI, Location])],
})
export class PoiModule {}
