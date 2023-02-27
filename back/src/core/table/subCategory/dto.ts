import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sort: number;

  @IsInt()
  @IsNotEmpty()
  route: string;

  @IsInt()
  @IsNotEmpty()
  category_id: number;
}

export class PutDto extends PartialType(CreateDto) {
  @IsInt()
  @IsNotEmpty()
  id: number
}