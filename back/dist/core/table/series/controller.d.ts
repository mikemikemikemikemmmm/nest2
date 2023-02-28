import { CreateDto, PutDto } from './dto';
import { SeriesService } from './service';
export declare class SeriesController {
    private readonly service;
    constructor(service: SeriesService);
    delete(id: number): Promise<import("../../../type").TResponse<unknown>>;
    put(id: number, data: PutDto): Promise<import("../../../type").TResponse<unknown>>;
    create(data: CreateDto): Promise<import("../../../type").TResponse<unknown>>;
}
