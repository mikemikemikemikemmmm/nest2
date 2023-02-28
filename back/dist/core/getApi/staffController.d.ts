import { DBService } from "src/core/db/service";
import { ConfigService } from "@nestjs/config";
export declare class GetStaffController {
    private dbService;
    private configService;
    constructor(dbService: DBService, configService: ConfigService);
    login(password: string): Promise<{
        error: string;
    } | {
        result: {
            token: string;
        };
    }>;
    getAllColorsApi(): Promise<import("../../type").TResponse<unknown>>;
    getColorsBySearchNameApi(name: string): Promise<import("../../type").TResponse<unknown>>;
    getProductCardDataByColorIdApi(colorId: number): Promise<import("../../type").TResponse<unknown>>;
    getAllNavDataForCategoryPageApi(): Promise<import("../../type").TResponse<unknown>>;
    getProductCardDataBySeriesIdApi(series_id: number): Promise<import("../../type").TResponse<unknown>>;
    getProductBySearchNameApi(name: string): Promise<import("../../type").TResponse<unknown>>;
    getProductsForProductPageApi(): Promise<import("../../type").TResponse<unknown>>;
    getSeriesDataForCreateProductApi(): Promise<import("../../type").TResponse<unknown>>;
    getProductDetailDataByProductIdApi(productId: number): Promise<{
        result: {
            colors: unknown[];
            series: unknown[];
            product: unknown[];
        };
    }>;
    getProductIdBySeriesIdAndNameApi(seriesId: number, name: string): Promise<import("../../type").TResponse<unknown>>;
}
