import { DBService } from 'src/core/db/service';
export declare class SubProductService {
    private dbService;
    tableName: string;
    constructor(dbService: DBService);
    delete(id: number): Promise<{
        error: string;
        result?: undefined;
    } | {
        result: string;
        error?: undefined;
    }>;
}
