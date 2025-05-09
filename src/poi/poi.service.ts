import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePoiDTO, POI, UpdatePoiDTO } from "./POI";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Position } from "typeorm";

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
    @InjectRepository(POI) private readonly poiRepository: Repository<POI>,
  ) {}

  findAll(): Promise<POI[]> {
    return this.poiRepository.find();
  }

  async find(args: Partial<POI>): Promise<POI[]> {
    const poi = await this.poiRepository.findOne({ where: { id: args.id } });
    if (!poi) {
      throw new NotFoundException("Poi not found");
    }
    return [poi];
  }

  create(poi: CreatePoiDTO): Promise<POI> {
    console.log(poi);
    const newPoi = this.poiRepository.create({
      ...poi,
      point: {
        type: "Point",
        coordinates: poi.point.coordinates, // [lng, lat]
      },
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
}
