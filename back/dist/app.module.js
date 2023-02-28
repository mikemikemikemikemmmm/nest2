"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const module_1 = require("./core/db/module");
const getModule_1 = require("./core/getApi/getModule");
const table_1 = require("./core/table/table");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const module_2 = require("./core/authApi/module");
const auth_1 = require("./core/middleware/auth");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(auth_1.AuthMiddleware)
            .exclude('authController/(.*)', 'getClientController/(.*)', 'static/(.*)')
            .forRoutes("*");
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            getModule_1.GetApiModule,
            module_2.AuthApiModule,
            table_1.TableModule,
            module_1.DBModule,
            config_1.ConfigModule.forRoot(),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
                serveRoot: '/static/'
            }),
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map