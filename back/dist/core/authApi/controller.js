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
exports.AuthController = exports.TestTokenDto = exports.LoginDto = void 0;
const common_1 = require("@nestjs/common");
const service_1 = require("../db/service");
const JWT = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const utils_1 = require("../utils");
const class_validator_1 = require("class-validator");
class LoginDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
exports.LoginDto = LoginDto;
class TestTokenDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TestTokenDto.prototype, "token", void 0);
exports.TestTokenDto = TestTokenDto;
let AuthController = class AuthController {
    constructor(dbService, configService) {
        this.dbService = dbService;
        this.configService = configService;
    }
    async login(data) {
        const { result, error } = await this.dbService.queryByRawSql(`
            select password
            from admin_user
            where name = '${data.name}'
        `);
        if (error) {
            return (0, utils_1.sendError)(error);
        }
        if (result.length === 0 || result.length >= 2) {
            return (0, utils_1.sendError)('無此用戶');
        }
        const hashedPassword = result[0].password;
        const compare = await bcrypt.compare(data.password, hashedPassword);
        if (!compare) {
            return (0, utils_1.sendError)('密碼不符');
        }
        const secret = this.configService.get("JWT_SECRET");
        const token = JWT.sign({ name: data.name }, secret);
        return {
            result: token
        };
    }
    async testToken(req) {
        const secret = this.configService.get("JWT_SECRET");
        const { token } = req.headers;
        if (Array.isArray(token) || typeof token !== 'string' || !token) {
            return { result: false };
        }
        try {
            const verify = await JWT.verify(token, secret);
            return { result: true };
        }
        catch (error) {
            return { result: false };
        }
    }
};
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('testToken'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testToken", null);
AuthController = __decorate([
    (0, common_1.Controller)('authController'),
    __metadata("design:paramtypes", [service_1.DBService, config_1.ConfigService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=controller.js.map