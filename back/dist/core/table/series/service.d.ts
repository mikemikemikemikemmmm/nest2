import { DBService } from 'src/core/db/service';
import { CreateDto, PutDto } from './dto';
export declare class SeriesService {
    private dbService;
    tableName: string;
    constructor(dbService: DBService);
    delete(id: number): Promise<import("../../../type").TResponse<unknown>>;
    put(id: number, data: PutDto): Promise<import("../../../type").TResponse<unknown>>;
    create(data: CreateDto): Promise<import("../../../type").TResponse<unknown>>;
}
