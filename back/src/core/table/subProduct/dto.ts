import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsPositive, IsBoolean, IsNumber } from 'class-validator';

export class CreateSubproductDto {//TODO
  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  sort: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  color_id: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsInt()
  @IsNotEmpty()
  size_s: number
  @IsInt()
  @IsNotEmpty()
  size_m: number
  @IsInt()
  @IsNotEmpty()
  size_l: number

}

export class PutDto extends PartialType(CreateSubproductDto) {
  @IsInt()
  @IsNotEmpty()
  id: number
}