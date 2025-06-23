"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protocol = void 0;
var common_1 = require("@nestjs/common");
exports.Protocol = (0, common_1.createParamDecorator)(function (defaultValue, ctx) {
    console.log(defaultValue);
    var request = ctx.switchToHttp().getRequest();
    return request.protocol;
});
