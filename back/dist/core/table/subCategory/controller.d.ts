import { CreateDto, PutDto } from './dto';
import { SubCategoryService } from './service';
export declare class SubCategoryController {
    private readonly service;
    constructor(service: SubCategoryService);
    delete(id: number): Promise<import("../../../type").TResponse<unknown>>;
    put(id: number, data: PutDto): Promise<import("../../../type").TResponse<unknown>>;
    create(data: CreateDto): Promise<import("../../../type").TResponse<unknown>>;
}
