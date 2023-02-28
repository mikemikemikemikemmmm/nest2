export declare class CreateDto {
    name: string;
}
declare const PutDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateDto>>;
export declare class PutDto extends PutDto_base {
    id: number;
}
export {};
