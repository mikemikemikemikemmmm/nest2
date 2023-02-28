import { SubProductService } from './service';
export declare class SubProductController {
    private readonly service;
    constructor(service: SubProductService);
    delete(id: number): Promise<{
        error: string;
        result?: undefined;
    } | {
        result: string;
        error?: undefined;
    }>;
}
