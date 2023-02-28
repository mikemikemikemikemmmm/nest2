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
exports.SeriesController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const dto_1 = require("./dto");
const service_1 = require("./service");
let SeriesController = class SeriesController {
    constructor(service) {
        this.service = service;
    }
    delete(id) {
        return this.service.delete(id);
    }
    put(id, data) {
        return this.service.put(id, data);
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
], SeriesController.prototype, "delete", null);
__decorate([
    (0, decorators_1.Put)(':id'),
    __param(0, (0, decorators_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.PutDto]),
    __metadata("design:returntype", void 0)
], SeriesController.prototype, "put", null);
__decorate([
    (0, decorators_1.Post)(),
    __param(0, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateDto]),
    __metadata("design:returntype", void 0)
], SeriesController.prototype, "create", null);
SeriesController = __decorate([
    (0, common_1.Controller)('series'),
    __metadata("design:paramtypes", [service_1.SeriesService])
], SeriesController);
exports.SeriesController = SeriesController;
//# sourceMappingURL=controller.js.map