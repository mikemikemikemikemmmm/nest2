"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableModule = void 0;
const common_1 = require("@nestjs/common");
const module_1 = require("./category/module");
const module_2 = require("./color/module");
const module_3 = require("./nav/module");
const module_4 = require("./product/module");
const module_5 = require("./series/module");
const module_6 = require("./subCategory/module");
const module_7 = require("./subProduct/module");
let TableModule = class TableModule {
};
TableModule = __decorate([
    (0, common_1.Module)({
        imports: [
            module_1.CategoryModule,
            module_2.ColorModule,
            module_3.NavModule,
            module_4.ProductModule,
            module_5.SeriesModule,
            module_6.SubCategoryModule,
            module_7.SubProductModule,
        ],
    })
], TableModule);
exports.TableModule = TableModule;
//# sourceMappingURL=table.js.map