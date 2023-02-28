export declare class CreateSubproductDto {
    price: number;
    sort: number;
    color_id: number;
    product_id: number;
    size_s: number;
    size_m: number;
    size_l: number;
}
declare const PutDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateSubproductDto>>;
export declare class PutDto extends PutDto_base {
    id: number;
}
export {};
