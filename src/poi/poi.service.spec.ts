import { Test, TestingModule } from "@nestjs/testing";
import { PoiService } from "./poi.service";
import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { Location } from "../location/location";
import { POI } from "./interface/POI";
import { getRepositoryToken } from "@nestjs/typeorm";
import { NotFoundException } from "@nestjs/common";

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe("PoiService", () => {
  let service: PoiService;
  let poiRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoiService,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(Location),
          useValue: createMockRepository(),
        },
        { provide: getRepositoryToken(POI), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<PoiService>(PoiService);
    poiRepository = module.get<MockRepository>(getRepositoryToken(POI));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findOne", () => {
    describe("id exists", () => {
      it("should return a Poi", async () => {
        poiRepository.findOne?.mockReturnValue({});
        const anything = await service.find({ id: 1 });
        expect(anything).toEqual([{}]);
      });
    });

    describe("id doesn't exists", () => {
      it("should throw a NotFoundException", async () => {
        poiRepository.findOne?.mockReturnValue(undefined);

        try {
          await service.find({ id: -1 });
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual("Poi not found");
        }
      });
    });
  });
});
