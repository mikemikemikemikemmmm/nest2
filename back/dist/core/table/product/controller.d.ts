/// <reference types="multer" />
import { CreateDto } from './dto';
import { FormDataBody } from 'src/type';
import { ProductService } from './service';
export declare class ProductController {
    private readonly service;
    constructor(service: ProductService);
    delete(id: number): Promise<import("src/type").TResponse<unknown>>;
    put(id: number, formdataBody: FormDataBody, files: Array<Express.Multer.File>): Promise<{
        error: string;
    } | {
        error: any;
        result?: undefined;
    } | {
        result: string;
        error?: undefined;
    } | "驗證錯誤">;
    create(data: CreateDto): Promise<import("src/type").TResponse<unknown>>;
}
