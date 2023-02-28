/// <reference types="multer" />
import { CreateDto, PutDto } from './dto';
import { NavService } from './service';
export declare class NavController {
    private readonly service;
    constructor(service: NavService);
    delete(id: number): Promise<import("../../../type").TResponse<any>>;
    put(id: number, data: PutDto): Promise<import("../../../type").TResponse<unknown>>;
    putImg(id: number, file: Express.Multer.File): Promise<{
        error: string;
        result?: undefined;
    } | {
        result: string;
        error?: undefined;
    }>;
    create(data: CreateDto): Promise<import("../../../type").TResponse<unknown>>;
}
