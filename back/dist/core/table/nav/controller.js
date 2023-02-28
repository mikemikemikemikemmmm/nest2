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
exports.NavController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const pipes_1 = require("@nestjs/common/pipes");
const dto_1 = require("./dto");
const service_1 = require("./service");
let NavController = class NavController {
    constructor(service) {
        this.service = service;
    }
    delete(id) {
        return this.service.delete(id);
    }
    put(id, data) {
        return this.service.put(id, data);
    }
    putImg(id, file) {
        return this.service.putImg(id, file);
    }
    create(data) {
        return this.service.create(data);
    }
};
__decorate([
    (0, decorators_1.Delete)(':id'),
    __param(0, (0, decorators_1.Param)('id', new pipes_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NavController.prototype, "delete", null);
__decorate([
    (0, decorators_1.Put)(':id'),
    (0, decorators_1.UsePipes)(pipes_1.ValidationPipe),
    __param(0, (0, decorators_1.Param)('id', new pipes_1.ParseIntPipe())),
    __param(1, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.PutDto]),
    __metadata("design:returntype", void 0)
], NavController.prototype, "put", null);
__decorate([
    (0, decorators_1.Put)('img/:id'),
    (0, decorators_1.UsePipes)(pipes_1.ValidationPipe),
    __param(0, (0, decorators_1.Param)('id', new pipes_1.ParseIntPipe())),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: 'jpeg',
    })
        .build({
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], NavController.prototype, "putImg", null);
__decorate([
    (0, decorators_1.Post)(),
    (0, decorators_1.UsePipes)(pipes_1.ValidationPipe),
    __param(0, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateDto]),
    __metadata("design:returntype", void 0)
], NavController.prototype, "create", null);
NavController = __decorate([
    (0, common_1.Controller)('nav'),
    __metadata("design:paramtypes", [service_1.NavService])
], NavController);
exports.NavController = NavController;
//# sourceMappingURL=controller.js.map