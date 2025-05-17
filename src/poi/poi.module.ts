import { Module } from "@nestjs/common";
import { PoiService } from "./poi.service";
import { PoiController } from "./poi.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { POI } from "./interface/POI";
import { Location } from "../location/location";
import { EventEntity } from "src/events/entities/event.entity/event.entity";
import { ConfigModule } from "@nestjs/config";
import poisConfig from "./config/pois.config";

@Module({
  providers: [PoiService],
  controllers: [PoiController],
  imports: [
    TypeOrmModule.forFeature([POI, Location, EventEntity]),
    ConfigModule.forFeature(poisConfig),
  ],
})
export class PoiModule {}
