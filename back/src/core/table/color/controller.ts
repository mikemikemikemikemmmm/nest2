import { Controller, HttpStatus, ParseFilePipeBuilder, ParseIntPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Body, Delete, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateDto, PutDto } from './dto';
import { ColorService } from './service';
import { FormDataBody } from 'src/type';
import { validateOrReject } from 'class-validator';
import { sendError, isObj } from 'src/core/utils';
@Controller('color')
export class ColorController {
  constructor(private readonly service: ColorService) { }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
  @Put(':id')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 1024 * 1024 * 10 //10MB
    }
  }))
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() formdataBody: FormDataBody,
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
    try {
      const data = JSON.parse(formdataBody.stringifyJson)
      if (!isObj(data)) {
        return sendError('error')
      }
      const putDto = new PutDto()
      putDto.name = data.name
      putDto.id = id
      await validateOrReject(putDto);
      return this.service.put(id, data, file)
    } catch (e) {
      return sendError(e)
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 1024 * 1024 * 10 //10MB
    }
  }))
  async create(
    @Body() formdataBody: FormDataBody,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    ) file: Express.Multer.File) {
    try {
      const data = JSON.parse(formdataBody.stringifyJson)
      if (!isObj(data)) {
        return sendError('error')
      }
      const dto = new CreateDto()
      dto.name = data.name
      await validateOrReject(dto);
      return this.service.create(data, file)
    } catch (e) {
      return sendError(e)
    }
  }
}
