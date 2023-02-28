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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const pipes_1 = require("@nestjs/common/pipes");
const platform_express_1 = require("@nestjs/platform-express");
const utils_1 = require("../../utils");
const dto_1 = require("./dto");
const service_1 = require("./service");
let ProductController = class ProductController {
    constructor(service) {
        this.service = service;
    }
    delete(id) {
        return this.service.delete(id);
    }
    async put(id, formdataBody, files) {
        try {
            const data = JSON.parse(formdataBody.stringifyJson);
            if (!(0, utils_1.isObj)(data)) {
                throw new Error("");
            }
            const newSubproduct = data.sub_products.filter(sp => sp.id < 0);
            return this.service.put(id, data, files);
        }
        catch (e) {
            return (0, utils_1.sendError)(e) || '驗證錯誤';
        }
    }
    create(data) {
        return this.service.create(data);
    }
};
__decorate([
    (0, decorators_1.Delete)(':id'),
    __param(0, (0, decorators_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "delete", null);
__decorate([
    (0, decorators_1.Put)(':id'),
    (0, decorators_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    __param(0, (0, decorators_1.Param)('id', pipes_1.ParseIntPipe)),
    __param(1, (0, decorators_1.Body)()),
    __param(2, (0, decorators_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Array]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "put", null);
__decorate([
    (0, decorators_1.Post)(),
    __param(0, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "create", null);
ProductController = __decorate([
    (0, common_1.Controller)('product'),
    __metadata("design:paramtypes", [service_1.ProductService])
], ProductController);
exports.ProductController = ProductController;
//# sourceMappingURL=controller.js.map