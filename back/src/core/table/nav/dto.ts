import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsInt, IsNumberString } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  sort: number;

  @IsString()
  @IsNotEmpty()
  route: string;
}

export class PutDto extends PartialType(CreateDto) {
  @IsInt()
  @IsNotEmpty()
  id: number
}