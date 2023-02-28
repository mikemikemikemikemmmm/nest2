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
exports.ColorController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const decorators_1 = require("@nestjs/common/decorators");
const dto_1 = require("./dto");
const service_1 = require("./service");
const class_validator_1 = require("class-validator");
const utils_1 = require("../../utils");
let ColorController = class ColorController {
    constructor(service) {
        this.service = service;
    }
    delete(id) {
        return this.service.delete(id);
    }
    async put(id, formdataBody, file) {
        try {
            const data = JSON.parse(formdataBody.stringifyJson);
            if (!(0, utils_1.isObj)(data)) {
                return (0, utils_1.sendError)('error');
            }
            const putDto = new dto_1.PutDto();
            putDto.name = data.name;
            putDto.id = id;
            await (0, class_validator_1.validateOrReject)(putDto);
            return this.service.put(id, data, file);
        }
        catch (e) {
            return (0, utils_1.sendError)(e);
        }
    }
    async create(formdataBody, file) {
        try {
            const data = JSON.parse(formdataBody.stringifyJson);
            if (!(0, utils_1.isObj)(data)) {
                return (0, utils_1.sendError)('error');
            }
            const dto = new dto_1.CreateDto();
            dto.name = data.name;
            await (0, class_validator_1.validateOrReject)(dto);
            return this.service.create(data, file);
        }
        catch (e) {
            return (0, utils_1.sendError)(e);
        }
    }
};
__decorate([
    (0, decorators_1.Delete)(':id'),
    __param(0, (0, decorators_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ColorController.prototype, "delete", null);
__decorate([
    (0, decorators_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 1024 * 1024 * 10
        }
    })),
    __param(0, (0, decorators_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, decorators_1.Body)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: 'jpeg',
    })
        .build({
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ColorController.prototype, "put", null);
__decorate([
    (0, decorators_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 1024 * 1024 * 10
        }
    })),
    __param(0, (0, decorators_1.Body)()),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: 'jpeg',
    })
        .build({
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: true,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ColorController.prototype, "create", null);
ColorController = __decorate([
    (0, common_1.Controller)('color'),
    __metadata("design:paramtypes", [service_1.ColorService])
], ColorController);
exports.ColorController = ColorController;
//# sourceMappingURL=controller.js.map