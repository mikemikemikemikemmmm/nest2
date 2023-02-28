import { DBService } from "src/core/db/service";
export declare class GetClientController {
    private dbService;
    constructor(dbService: DBService);
    getAllNavApi(): Promise<import("../../type").TResponse<unknown>>;
    getProductCardDataOnNavIndexApi(navRoute: string): Promise<import("../../type").TResponse<unknown>>;
    getSeriesDataByRouteApi(subcategoryRoute: string, categoryRoute: string, navRoute: string): Promise<import("../../type").TResponse<unknown>>;
    getProductDetailByProductIdApi(productId: number): Promise<import("../../type").TResponse<unknown>>;
}
