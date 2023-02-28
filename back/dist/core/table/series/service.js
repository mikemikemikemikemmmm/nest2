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
exports.SeriesService = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("../../db/service");
let SeriesService = class SeriesService {
    constructor(dbService) {
        this.dbService = dbService;
        this.tableName = 'series';
    }
    async delete(id) {
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
        const hasSameParentAndName = await this.dbService.queryByRawSql(`
      select id
      from series
      where sub_category_id = ${data.sub_category_id} and name = '${data.name}' and id != ${id};
    `);
        if (hasSameParentAndName.result.length > 0) {
            return {
                error: '已有相同的父元素跟名稱'
            };
        }
        return await this.dbService.put(data, this.tableName, id);
    }
    async create(data) {
        const hasSameParentAndName = await this.dbService.queryByRawSql(`
      select id
      from series
      where sub_category_id = ${data.sub_category_id} and name = '${data.name}';
    `);
        if (hasSameParentAndName.result.length > 0) {
            return {
                error: '已有相同的父元素跟名稱'
            };
        }
        return await this.dbService.create(data, this.tableName);
    }
};
SeriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [service_1.DBService])
], SeriesService);
exports.SeriesService = SeriesService;
//# sourceMappingURL=service.js.map