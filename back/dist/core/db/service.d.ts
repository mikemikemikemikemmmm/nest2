import { QueryOptions, QueryOptionsWithType, QueryTypes, Sequelize } from "sequelize";
import { TResponse } from "src/type";
export declare class DBService {
    readonly dbUrl: string;
    sequelize: Sequelize;
    constructor(dbUrl: string);
    ensureConnect(): Promise<void>;
    queryByCustomizeRawSql<T>(sqlStr: string): Promise<{
        result: [T, unknown[]];
        error?: undefined;
    } | {
        error: any;
        result?: undefined;
    }>;
    queryByRawSql<T>(sqlStr: string, options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW>): Promise<TResponse<T>>;
    hasSameValueByColName(colName: string, value: string | number, tableName: string, selfId?: number): Promise<boolean | {
        error: string;
    }>;
    hasChild(id: number, childTableName: "category" | "series" | "sub_category"): Promise<boolean | {
        error: string;
    }>;
    hasId(id: number, tableName: string): Promise<boolean | {
        error: string;
    }>;
    create(data: object, tableName: string): Promise<TResponse<unknown>>;
    put(data: object, tableName: string, id: number, excludeKeys?: string[]): Promise<TResponse<unknown>>;
    delete(tableName: string, id: number): Promise<TResponse<unknown>>;
}
