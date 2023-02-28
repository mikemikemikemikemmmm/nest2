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
exports.SubProductService = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const FS = require("fs");
const service_1 = require("../../db/service");
let SubProductService = class SubProductService {
    constructor(dbService) {
        this.dbService = dbService;
        this.tableName = 'sub_product';
    }
    async delete(id) {
        const hasId = await this.dbService.hasId(id, this.tableName);
        if (!hasId) {
            return { error: '沒有此ID' };
        }
        const copyOrigin = await this.dbService.queryByRawSql(`
      select *
      from sub_product
      where id = ${id}
    `);
        const executeDelete = await this.dbService.delete(this.tableName, id);
        if (executeDelete.error || copyOrigin.error) {
            return {
                error: executeDelete.error || copyOrigin.error
            };
        }
        ;
        try {
            const fileName = `${id}.jpg`;
            const abosultePath = path.join(__dirname, '../', '../', '../', '../', 'public', 'subProducts', fileName);
            await FS.promises.unlink(abosultePath);
        }
        catch (error) {
            const executeRecover = await this.dbService.create(copyOrigin.result[0], this.tableName);
            if (executeRecover.error) {
                return {
                    error: '刪除圖片時失敗'
                };
            }
            return {
                error: '刪除圖片時失敗且已刪除sql'
            };
        }
        return {
            result: '刪除成功'
        };
    }
};
SubProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [service_1.DBService])
], SubProductService);
exports.SubProductService = SubProductService;
//# sourceMappingURL=service.js.map