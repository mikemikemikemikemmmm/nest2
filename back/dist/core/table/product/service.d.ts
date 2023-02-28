/// <reference types="multer" />
import { DBService } from 'src/core/db/service';
import { CreateDto, PutDto } from './dto';
import { TResponse } from 'src/type';
export declare class ProductService {
    private dbService;
    tableName: string;
    constructor(dbService: DBService);
    delete(id: number): Promise<TResponse<unknown>>;
    put(id: number, putProductData: PutDto, files: Array<Express.Multer.File>): Promise<{
        error: any;
        result?: undefined;
    } | {
        result: string;
        error?: undefined;
    }>;
    create(data: CreateDto): Promise<TResponse<unknown>>;
}
