import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsInt, IsIn, IsPositive, ValidateNested } from 'class-validator';
import * as spDto from '../subProduct/dto';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  sort: number;

  @IsString()
  @IsNotEmpty()
  series_id: number;

  @ValidateNested()
  sub_products: spDto.PutDto[]
}
export class PutDto extends PartialType(CreateDto) {
  @IsInt()
  @IsNotEmpty()
  id: number

  @ValidateNested()
  sub_products: spDto.PutDto[]
}
// export interface ICreateSubProduct {
//   id: number,
//   sort: number,
//   price: number,
//   color_id: number,
//   color_name: string
//   size_s: number,
//   size_m: number
//   size_l: number,
// //   is_new: boolean,
// // }
// export interface ICreateProduct {
//   name: string,
//   sort: number,
//   series_id: number
// }