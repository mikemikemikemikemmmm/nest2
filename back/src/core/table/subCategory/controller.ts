import { Controller, Get } from '@nestjs/common';
import { Body, Delete, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateDto, PutDto } from './dto';
import { SubCategoryService } from './service';
@Controller('subCategory')
export class SubCategoryController {
  constructor(private readonly service: SubCategoryService) { }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
  @Put(':id')
  put(@Param('id') id: number, @Body() data: PutDto) {
    return this.service.put(id, data);
  }
  @Post()
  create(@Body() data: CreateDto) {
    return this.service.create(data);
  }
}
