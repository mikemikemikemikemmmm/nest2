import { Controller, HttpStatus, ParseFilePipeBuilder, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Body, Delete, Param, Post, Put, UsePipes } from '@nestjs/common/decorators';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { CreateDto, PutDto } from './dto';
import { NavService } from './service';
@Controller('nav')
export class NavController {
  constructor(private readonly service: NavService) { }

  @Delete(':id')
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.service.delete(id);
  }
  @Put(':id')
  @UsePipes(ValidationPipe)
  put(@Param('id', new ParseIntPipe()) id: number, @Body() data: PutDto) {
    return this.service.put(id, data);
  }
  @Put('img/:id')
  @UsePipes(ValidationPipe)
  putImg(
    @Param('id', new ParseIntPipe()) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    ) file: Express.Multer.File) {
    return this.service.putImg(id, file);
  }
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() data: CreateDto) {
    return this.service.create(data);
  }


}
