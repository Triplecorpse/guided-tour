import { Module } from "@nestjs/common";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { POI } from "../poi/POI";
import { Location } from "./location";

@Module({
  imports: [TypeOrmModule.forFeature([POI, Location])],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
