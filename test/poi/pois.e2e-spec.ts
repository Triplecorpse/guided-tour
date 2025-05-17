import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { App } from "supertest/types";
import { PoiModule } from "../../src/poi/poi.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { POI } from "../../src/poi/interface/POI";
import { CreateLocationDTO, Location } from "../../src/location/location";
import { GeoPointDTO } from "../../src/poi/interface/GeoPointDTO";
import * as request from "supertest";
import { CreatePoiDTO } from "../../src/poi/interface/CreatePoiDTO";
import process from "node:process";

describe("[Feature] Pois - /poi (e2e)", () => {
  let app: INestApplication<App>;
  const location: CreateLocationDTO = {
    name: "Somewhere",
  };
  const point: GeoPointDTO = {
    type: "Point",
    coordinates: [12, 13],
  };
  const poi: CreatePoiDTO = {
    type: "museum",
    location,
    name: "A Person",
    point: point,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PoiModule,
        TypeOrmModule.forRoot({
          type: "postgres",
          host: "localhost",
          port: 5433,
          username: "postgres",
          password: "pass123",
          database: "postgres",
          synchronize: true,
          autoLoadEntities: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it("Create [POST /]", () => {
    return request(app.getHttpServer())
      .post("/poi")
      .send(poi)
      .expect(HttpStatus.CREATED);
  });
  it("Get all [GET /]", () => {
    return request(app.getHttpServer()).get("/poi/all").expect(HttpStatus.OK);
  });
  it("Get by id [GET /:id]", () => {
    return request(app.getHttpServer()).get("/poi/1").expect(HttpStatus.OK);
  });
  it("Get by id [GET /:id]", () => {
    return request(app.getHttpServer())
      .get("/poi/-1")
      .expect(HttpStatus.NOT_FOUND);
  });
  it("PATCH by id [PATCH /:id]", () => {
    return request(app.getHttpServer())
      .patch("/poi/1")
      .send({ name: "The People" })
      .expect(HttpStatus.OK);
  });
  it("Delete by id [DELETE /:id]", () => {
    return request(app.getHttpServer()).delete("/poi/1").expect(HttpStatus.OK);
  });

  afterAll(async () => {
    // await app.close();
  });
});
