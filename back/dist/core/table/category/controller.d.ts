import { CreateDto, PutDto } from './dto';
import { CategoryService } from './service';
export declare class CategoryController {
    private readonly service;
    constructor(service: CategoryService);
    delete(id: number): Promise<import("../../../type").TResponse<unknown>>;
    put(data: PutDto, id: number): Promise<import("../../../type").TResponse<unknown>>;
    create(data: CreateDto): Promise<import("../../../type").TResponse<unknown>>;
}
