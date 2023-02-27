import { Controller, Get } from '@nestjs/common';
import { Body, Delete, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { SubProductService } from './service';
@Controller('subProduct')
export class SubProductController {
  constructor(private readonly service: SubProductService) { }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
