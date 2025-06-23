"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process = require("node:process");
exports.default = (function () {
    var _a, _b;
    return ({
        environment: (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development",
        database: {
            host: process.env.DATABASE_HOST,
            port: (_b = parseInt(process.env.DATABASE_PORT, 10)) !== null && _b !== void 0 ? _b : 5432,
        },
    });
});
