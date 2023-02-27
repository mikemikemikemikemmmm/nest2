import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';
export class CreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class PutDto extends PartialType(CreateDto) {
  @IsInt()
  @IsNotEmpty()
  id: number
}