import { Injectable } from '@nestjs/common';
import { DBService } from 'src/core/db/service';
import { CreateDto, PutDto } from './dto';
@Injectable()
export class SeriesService {
  tableName: string;
  constructor(private dbService: DBService) {
    this.tableName = 'series';
  }
  async delete(id: number) {
    const hasId = await this.dbService.hasId(id, this.tableName);
    if (!hasId) {
      return {
        error: '沒有此ID'
      }
    }
    return await this.dbService.delete(this.tableName, id);
  }
  async put(id: number, data: PutDto) {
    const hasId = await this.dbService.hasId(id, this.tableName);
    if (!hasId) {
      return {
        error: '沒有此ID'
      }
    }
    const hasSameParentAndName = await this.dbService.queryByRawSql(`
      select id
      from series
      where sub_category_id = ${data.sub_category_id} and name = '${data.name}' and id != ${id};
    `)
    if (hasSameParentAndName.result.length > 0) {
      return {
        error: '已有相同的父元素跟名稱'
      }
    }
    return await this.dbService.put(data, this.tableName, id);
  }
  async create(data: CreateDto) {
    const hasSameParentAndName = await this.dbService.queryByRawSql(`
      select id
      from series
      where sub_category_id = ${data.sub_category_id} and name = '${data.name}';
    `)
    if (hasSameParentAndName.result.length > 0) {
      return {
        error: '已有相同的父元素跟名稱'
      }
    }
    return await this.dbService.create(data, this.tableName);
  }
}
