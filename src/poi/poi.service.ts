import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePoiDTO, POI, UpdatePoiDTO } from "./POI";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Position } from "typeorm";
import {
  CreateLocationDTO,
  Location,
  UpdateLocationDTO,
} from "../location/location";

class GeoPoint {
  type = "Point" as const;
  coordinates: Position;

  constructor(lng: number, lat: number) {
    this.coordinates = [lng, lat];
  }
}

@Injectable()
export class PoiService {
  constructor(
    @InjectRepository(POI)
    private readonly poiRepository: Repository<POI>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  findAll(): Promise<POI[]> {
    return this.poiRepository.find({
      relations: ["location"],
    });
  }

  async find(args: Partial<POI>): Promise<POI[]> {
    const poi = await this.poiRepository.findOne({
      where: { id: args.id },
      relations: ["location"],
    });
    if (!poi) {
      throw new NotFoundException("Poi not found");
    }
    return [poi];
  }

  create(poi: CreatePoiDTO): Promise<POI> {
    const newPoi = this.poiRepository.create({
      ...poi,
      point: {
        type: "Point",
        coordinates: poi.point.coordinates, // [lng, lat]
      },
      location: poi.location,
    });
    return this.poiRepository.save(newPoi);
  }

  async update(poi: UpdatePoiDTO): Promise<POI> {
    const newPoi = await this.poiRepository.preload({
      ...poi,
      point: poi.point ? new GeoPoint(...poi.point.coordinates) : undefined,
    });
    if (!newPoi) {
      throw new NotFoundException("Poi not found");
    }
    await this.poiRepository.save(newPoi);
    return newPoi;
  }

  async remove(ids: number[]): Promise<number[]> {
    for (const id of ids) {
      const poi = await this.find({ id });
      await this.poiRepository.remove(poi);
    }

    return ids;
  }

  private async preloadLocation(
    location: Partial<CreateLocationDTO | UpdateLocationDTO>,
  ): Promise<Location> {
    if ("id" in location && location.id) {
      const foundLocation = await this.locationRepository.findOne({
        where: { id: location.id },
      });

      if (!foundLocation) {
        throw new NotFoundException("Location not found");
      }

      return foundLocation;
    }
    return this.locationRepository.create(location);
  }
}
