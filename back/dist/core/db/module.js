"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBModule = void 0;
const decorators_1 = require("@nestjs/common/decorators");
const service_1 = require("./service");
const config_1 = require("@nestjs/config");
const DBProvider = {
    provide: service_1.DBService,
    useFactory: async (configService) => {
        const dbUrl = configService.get('DB_URL');
        const db = new service_1.DBService(dbUrl);
        await db.ensureConnect();
        return db;
    },
    inject: [config_1.ConfigService],
};
let DBModule = class DBModule {
};
DBModule = __decorate([
    (0, decorators_1.Global)(),
    (0, decorators_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [DBProvider],
        exports: [DBProvider],
    })
], DBModule);
exports.DBModule = DBModule;
//# sourceMappingURL=module.js.map