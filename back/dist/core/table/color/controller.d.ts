/// <reference types="multer" />
import { ColorService } from './service';
import { FormDataBody } from 'src/type';
export declare class ColorController {
    private readonly service;
    constructor(service: ColorService);
    delete(id: number): Promise<{
        error: string;
        result?: undefined;
    } | {
        result: string;
        error?: undefined;
    }>;
    put(id: number, formdataBody: FormDataBody, file: Express.Multer.File): Promise<{
        error: string;
    } | {
        result: string;
    }>;
    create(formdataBody: FormDataBody, file: Express.Multer.File): Promise<{
        error: string;
    } | {
        error: any;
        result?: undefined;
    } | {
        result: string;
        error?: undefined;
    }>;
}
