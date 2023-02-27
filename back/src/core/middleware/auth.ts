
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken'
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private configService: ConfigService) { }
    use(req: Request, res: Response, next: NextFunction) {
        const secret = this.configService.get("JWT_SECRET")
        const { token } = req.headers
        if (Array.isArray(token) || typeof token !== 'string' || !token) {
            return res.status(401).json({ error: '尚未登入' });
        }
        JWT.verify(token, secret, (error, decoded) => {
            if (error) {
                return res.status(401).json({ error: '尚未登入' });
            } else {
                next();
            }
        })
    }
}
