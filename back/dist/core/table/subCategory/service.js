"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryService = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("../../db/service");
let SubCategoryService = class SubCategoryService {
    constructor(dbService) {
        this.dbService = dbService;
        this.tableName = 'sub_category';
    }
    async delete(id) {
        const hasChild = await this.dbService.hasChild(id, 'series');
        if (hasChild) {
            return {
                error: '不能刪除含有子元素的類別'
            };
        }
        const hasId = await this.dbService.hasId(id, this.tableName);
        if (!hasId) {
            return {
                error: '沒有此ID'
            };
        }
        return await this.dbService.delete(this.tableName, id);
    }
    async put(id, data) {
        const hasId = await this.dbService.hasId(id, this.tableName);
        if (!hasId) {
            return {
                error: '沒有此ID'
            };
        }
        const hasSameParentAndRoute = await this.dbService.queryByRawSql(`
      select id
      from sub_category
      where category_id = ${data.category_id} and route = '${data.route}' and id !=${id};
    `);
        if (hasSameParentAndRoute.result.length > 0) {
            return {
                error: '已有相同的父元素跟路徑'
            };
        }
        return this.dbService.put(data, this.tableName, id);
    }
    async create(data) {
        const hasSameParentAndRoute = await this.dbService.queryByRawSql(`
      select id
      from sub_category
      where category_id = ${data.category_id} and route = '${data.route}';
    `);
        if (hasSameParentAndRoute.result.length > 0) {
            return {
                error: '已有相同的父元素跟路徑'
            };
        }
        return this.dbService.create(data, this.tableName);
    }
};
SubCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [service_1.DBService])
], SubCategoryService);
exports.SubCategoryService = SubCategoryService;
//# sourceMappingURL=service.js.map