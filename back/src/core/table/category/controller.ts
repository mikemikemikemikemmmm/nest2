import { Controller, Get } from '@nestjs/common';
import { Body, Delete, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateDto, PutDto } from './dto';
import { CategoryService } from './service';


@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) { }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
  @Put(':id')
  put(@Body() data: PutDto, @Param('id') id: number) {
    return this.service.put(id, data);
  }
  @Post()
  create(@Body() data: CreateDto) {
    return this.service.create(data);
  }
}
