export declare const verityJWT: (token: string) => void;
export declare const sendError: (error: Error | string) => {
    error: string;
};
export declare const sendResult: (result: unknown) => {
    result: unknown;
};
export declare const validDtoByStringfyJson: (dto: Object, json: object) => Promise<{
    error: string;
}>;
export declare const isObj: (val: object) => boolean;
export declare const createPutSqlSetStr: (data: object, excludeKeys?: string[]) => string;
