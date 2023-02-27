import { Controller, Get, HttpStatus } from '@nestjs/common';
import { Body, Delete, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common/decorators';
import { ParseFilePipeBuilder, ParseIntPipe } from '@nestjs/common/pipes';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { isObj, sendError } from 'src/core/utils';
import { CreateDto, PutDto } from './dto';
import { FormDataBody } from 'src/type';

import { ProductService } from './service';
import { validateOrReject } from 'class-validator';
@Controller('product')//TODO
export class ProductController {
  constructor(private readonly service: ProductService) { }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() formdataBody: FormDataBody,
    @UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      const data = JSON.parse(formdataBody.stringifyJson) as PutDto
      if (!isObj(data)) {
        throw new Error("");
      }
      const newSubproduct = data.sub_products.filter(sp => sp.id < 0)
      // await validateOrReject()
      // newSubproduct
      return this.service.put(id, data, files)
    } catch (e) {
      return sendError(e) || '驗證錯誤'

    }
  }
  @Post()
  create(@Body() data: CreateDto) {
    return this.service.create(data)
  }
}
