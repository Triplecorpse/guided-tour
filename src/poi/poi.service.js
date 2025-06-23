"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoiService = void 0;
var common_1 = require("@nestjs/common");
var event_entity_1 = require("../events/entities/event.entity/event.entity");
var GeoPoint = /** @class */ (function () {
    function GeoPoint(lng, lat) {
        this.type = "Point";
        this.coordinates = [lng, lat];
    }
    return GeoPoint;
}());
var PoiService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PoiService = _classThis = /** @class */ (function () {
        function PoiService_1(poiRepository, locationRepository, connection) {
            this.poiRepository = poiRepository;
            this.locationRepository = locationRepository;
            this.connection = connection;
        }
        PoiService_1.prototype.findAll = function (paginationQuery) {
            var limit = paginationQuery.limit, offset = paginationQuery.offset;
            return this.poiRepository.find({
                relations: ["location"],
                skip: offset,
                take: limit,
            });
        };
        PoiService_1.prototype.find = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var poi;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.poiRepository.findOne({
                                where: { id: args.id },
                                relations: ["location"],
                            })];
                        case 1:
                            poi = _a.sent();
                            if (!poi) {
                                throw new common_1.NotFoundException("Poi not found");
                            }
                            return [2 /*return*/, [poi]];
                    }
                });
            });
        };
        PoiService_1.prototype.create = function (poi) {
            var newPoi = this.poiRepository.create(__assign(__assign({}, poi), { point: {
                    type: "Point",
                    coordinates: poi.point.coordinates, // [lng, lat]
                }, location: poi.location }));
            return this.poiRepository.save(newPoi);
        };
        PoiService_1.prototype.update = function (poi) {
            return __awaiter(this, void 0, void 0, function () {
                var newPoi;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.poiRepository.preload(__assign(__assign({}, poi), { point: poi.point ? new (GeoPoint.bind.apply(GeoPoint, __spreadArray([void 0], poi.point.coordinates, false)))() : undefined }))];
                        case 1:
                            newPoi = _a.sent();
                            if (!newPoi) {
                                throw new common_1.NotFoundException("Poi not found");
                            }
                            return [4 /*yield*/, this.poiRepository.save(newPoi)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, newPoi];
                    }
                });
            });
        };
        PoiService_1.prototype.remove = function (ids) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, ids_1, id, poi;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _i = 0, ids_1 = ids;
                            _a.label = 1;
                        case 1:
                            if (!(_i < ids_1.length)) return [3 /*break*/, 5];
                            id = ids_1[_i];
                            return [4 /*yield*/, this.find({ id: id })];
                        case 2:
                            poi = _a.sent();
                            return [4 /*yield*/, this.poiRepository.remove(poi)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/, ids];
                    }
                });
            });
        };
        PoiService_1.prototype.preloadLocation = function (location) {
            return __awaiter(this, void 0, void 0, function () {
                var foundLocation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!("id" in location && location.id)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.locationRepository.findOne({
                                    where: { id: location.id },
                                })];
                        case 1:
                            foundLocation = _a.sent();
                            if (!foundLocation) {
                                throw new common_1.NotFoundException("Location not found");
                            }
                            return [2 /*return*/, foundLocation];
                        case 2: return [2 /*return*/, this.locationRepository.create(location)];
                    }
                });
            });
        };
        PoiService_1.prototype.recommendPOI = function (poi) {
            return __awaiter(this, void 0, void 0, function () {
                var queryRunner, recommendEvent, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            queryRunner = this.connection.createQueryRunner();
                            return [4 /*yield*/, queryRunner.connect()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, queryRunner.startTransaction()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, 7, 9]);
                            poi.recommendations++;
                            recommendEvent = new event_entity_1.EventEntity();
                            recommendEvent.name = "recommend_poi";
                            recommendEvent.type = "poi";
                            recommendEvent.payload = { poiId: poi.id };
                            return [4 /*yield*/, queryRunner.commitTransaction()];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 9];
                        case 5:
                            e_1 = _a.sent();
                            return [4 /*yield*/, queryRunner.rollbackTransaction()];
                        case 6:
                            _a.sent();
                            return [3 /*break*/, 9];
                        case 7: return [4 /*yield*/, queryRunner.release()];
                        case 8:
                            _a.sent();
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        return PoiService_1;
    }());
    __setFunctionName(_classThis, "PoiService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PoiService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PoiService = _classThis;
}();
exports.PoiService = PoiService;
