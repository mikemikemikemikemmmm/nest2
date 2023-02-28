/// <reference types="multer" />
import { DBService } from 'src/core/db/service';
import { TResponse } from 'src/type';
import { CreateDto, PutDto } from './dto';
export declare class NavService {
    private dbService;
    tableName: string;
    constructor(dbService: DBService);
    hasChild(id: number): Promise<boolean>;
    delete(id: number): Promise<TResponse<any>>;
    put(id: number, data: PutDto): Promise<TResponse<unknown>>;
    create(data: CreateDto): Promise<TResponse<unknown>>;
    putImg(id: number, file: Express.Multer.File): Promise<{
        error: string;
        result?: undefined;
    } | {
        result: string;
        error?: undefined;
    }>;
}
