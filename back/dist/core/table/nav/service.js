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
exports.NavService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const service_1 = require("../../db/service");
const FS = require("fs");
let NavService = class NavService {
    constructor(dbService) {
        this.dbService = dbService;
        this.tableName = 'nav';
    }
    async hasChild(id) {
        const sql = `
      select id 
      from category c
      where c.nav_id =${id}
    `;
        const result = await this.dbService.queryByRawSql(sql);
        return result.result.length > 0;
    }
    async delete(id) {
        const hasChild = await this.hasChild(id);
        if (hasChild) {
            return {
                error: '不能刪除含有子元素的類別'
            };
        }
        const hasId = await this.dbService.hasId(id, this.tableName);
        if (!hasId) {
            return {
                error: '此ID不存在'
            };
        }
        const deleteRes = await this.dbService.delete(this.tableName, id);
        return {
            result: deleteRes.result
        };
    }
    async put(id, data) {
        const hasId = await this.dbService.hasId(id, this.tableName);
        if (!hasId) {
            return {
                error: '此ID不存在'
            };
        }
        const hasSameRoute = await this.dbService.hasSameValueByColName('route', data.route, this.tableName, id);
        if (hasSameRoute) {
            return {
                error: '已有相同路徑'
            };
        }
        const hasSameName = await this.dbService.hasSameValueByColName('name', data.name, this.tableName, id);
        if (hasSameName) {
            return {
                error: '已有相同名稱'
            };
        }
        return this.dbService.put(data, this.tableName, id);
    }
    async create(data) {
        const hasSameRoute = await this.dbService.hasSameValueByColName('route', data.route, this.tableName);
        if (hasSameRoute) {
            return {
                error: '已有相同路徑'
            };
        }
        const hasSameName = await this.dbService.hasSameValueByColName('name', data.name, this.tableName);
        if (hasSameName) {
            return {
                error: '已有相同名稱'
            };
        }
        return this.dbService.create(data, this.tableName);
    }
    async putImg(id, file) {
        const hasId = await this.dbService.hasId(id, this.tableName);
        if (!hasId) {
            return {
                error: '此ID不存在'
            };
        }
        try {
            const fileName = `${id}.jpg`;
            const abosultePath = path_1.default.join(__dirname, '../', '../', '../', '../', 'public', 'nav', fileName);
            await FS.promises.writeFile(abosultePath, file.buffer);
        }
        catch (error) {
            return {
                error: '上傳圖片失敗'
            };
        }
        return {
            result: '修改成功'
        };
    }
};
NavService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [service_1.DBService])
], NavService);
exports.NavService = NavService;
//# sourceMappingURL=service.js.map