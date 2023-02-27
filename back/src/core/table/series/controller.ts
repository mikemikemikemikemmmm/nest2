import { Controller, Get } from '@nestjs/common';
import { Body, Delete, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateDto, PutDto } from './dto';
import { SeriesService } from './service';
@Controller('series')
export class SeriesController {
  constructor(private readonly service: SeriesService) { }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
  @Put(':id')
  put(@Param('id') id: number, data: PutDto) {
    return this.service.put(id, data);
  }
  @Post()
  create(@Body() data: CreateDto) {
    return this.service.create(data);
  }
}
