/// <reference types="multer" />
import { DBService } from 'src/core/db/service';
import { CreateDto, PutDto } from './dto';
export declare class ColorService {
    private dbService;
    tableName: string;
    constructor(dbService: DBService);
    test(str: string): Promise<import("../../../type").TResponse<unknown>>;
    delete(id: number): Promise<{
        error: string;
        result?: undefined;
    } | {
        result: string;
        error?: undefined;
    }>;
    put(id: number, data: PutDto, imageFile?: Express.Multer.File): Promise<{
        error: string;
    } | {
        result: string;
    }>;
    create(data: CreateDto, file: Express.Multer.File): Promise<{
        error: any;
        result?: undefined;
    } | {
        result: string;
        error?: undefined;
    }>;
}
