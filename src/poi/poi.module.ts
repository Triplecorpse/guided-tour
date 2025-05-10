import { Module } from "@nestjs/common";
import { PoiService } from "./poi.service";
import { PoiController } from "./poi.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { POI } from "./POI";
import { Location } from "../location/location";
import { EventEntity } from "src/events/entities/event.entity/event.entity";

@Module({
  providers: [PoiService],
  controllers: [PoiController],
  imports: [TypeOrmModule.forFeature([POI, Location, EventEntity])],
})
export class PoiModule {}
