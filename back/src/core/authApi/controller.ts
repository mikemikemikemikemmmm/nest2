import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { DBService } from "src/core/db/service";
import * as JWT from 'jsonwebtoken'
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt'
import { sendError } from "../utils";
import { Request } from "express";
import { IsNotEmpty, IsString } from "class-validator";
export class LoginDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}
export class TestTokenDto {
    @IsString()
    @IsNotEmpty()
    token: string;

}
@Controller('authController')
export class AuthController {
    constructor(private dbService: DBService, private configService: ConfigService) { }

    @Post('login')
    @UsePipes(ValidationPipe)
    async login(@Body() data: LoginDto) {
        const { result, error } = await this.dbService.queryByRawSql<{ password: string }>(`
            select password
            from admin_user
            where name = '${data.name}'
        `)
        if (error) {
            return sendError(error)
        }
        if (result.length === 0 || result.length >= 2) {
            return sendError('無此用戶')
        }
        const hashedPassword = result[0].password
        const compare = await bcrypt.compare(data.password, hashedPassword)
        if (!compare) {
            return sendError('密碼不符')
        }
        const secret = this.configService.get("JWT_SECRET")
        const token = JWT.sign({ name: data.name }, secret)
        return {
            result: token
        }
    }

    @Post('testToken')
    async testToken(@Req() req: Request) {
        const secret = this.configService.get("JWT_SECRET")
        const { token } = req.headers
        if (Array.isArray(token) || typeof token !== 'string' || !token) {
            return { result: false }
        }
        try {
            const verify = await JWT.verify(token, secret)
            return { result: true }
        } catch (error) {
            return { result: false }
        }

    }
}