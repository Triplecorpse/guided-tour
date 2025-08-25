import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Location } from "./location";
import { PaginationQueryDto } from "../common/pagination-query.dto/pagination-query.dto";
import { CreateLocationDTO, UpdateLocationDTO } from "./location.controller";

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Location[]> {
    const { limit, offset } = paginationQuery;
    return this.locationRepository.find({
      relations: ["children", "parent", "pois"],
      skip: offset,
      take: limit,
    });
  }

  async find(options: { id: number }): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: { id: options.id },
      relations: ["children", "parent", "pois"],
    });
  }

  async create(createLocationDto: CreateLocationDTO): Promise<Location> {
    const location = this.locationRepository.create({
      name: createLocationDto.name,
      parent: createLocationDto.parentId
        ? { id: createLocationDto.parentId }
        : null,
    });
    return this.locationRepository.save(location);
  }

  async update(updateLocationDto: UpdateLocationDTO): Promise<Location> {
    const location = await this.locationRepository.preload({
      id: updateLocationDto.id,
      name: updateLocationDto.name,
      parent: updateLocationDto.parentId
        ? { id: updateLocationDto.parentId }
        : null,
    });
    if (!location) {
      throw new Error(`Location with ID ${updateLocationDto.id} not found`);
    }
    return this.locationRepository.save(location);
  }

  async remove(ids: number[]): Promise<void> {
    await this.locationRepository.delete(ids);
  }
}
