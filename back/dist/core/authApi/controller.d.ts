import { DBService } from "src/core/db/service";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
export declare class LoginDto {
    name: string;
    password: string;
}
export declare class TestTokenDto {
    token: string;
}
export declare class AuthController {
    private dbService;
    private configService;
    constructor(dbService: DBService, configService: ConfigService);
    login(data: LoginDto): Promise<{
        error: string;
    } | {
        result: string;
    }>;
    testToken(req: Request): Promise<{
        result: boolean;
    }>;
}
