import * as spDto from '../subProduct/dto';
export declare class CreateDto {
    name: string;
    sort: number;
    series_id: number;
    sub_products: spDto.PutDto[];
}
declare const PutDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateDto>>;
export declare class PutDto extends PutDto_base {
    id: number;
    sub_products: spDto.PutDto[];
}
export {};
