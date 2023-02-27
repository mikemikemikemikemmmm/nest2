import { Injectable } from '@nestjs/common';
import { DBService } from 'src/core/db/service';
import { sendError } from 'src/core/utils';
import { CreateDto, PutDto } from './dto';
@Injectable()
export class CategoryService {
  tableName: string;
  constructor(private dbService: DBService) {
    this.tableName = 'category';
  }
  async delete(id: number) {
    const hasChild = await this.dbService.hasChild(id, 'sub_category');
    if (hasChild) {
      return {
        error: '不能刪除含有子元素的類別'
      };
    }
    const hasId = await this.dbService.hasId(id, this.tableName);
    if (!hasId) {
      return {
        error: '沒有此ID'
      }
    };
    return await this.dbService.delete(this.tableName, id);
  }
  async put(id: number, data: PutDto) {
    const hasId = await this.dbService.hasId(id, this.tableName);
    if (!hasId) {
      return {
        error: '此ID不存在'
      }
    }
    const hasSameRoute = await this.dbService.queryByRawSql(`
      select id
      from category
      where nav_id = ${data.nav_id} and route = '${data.route}';
    `)
    if (hasSameRoute.result.length > 0) {
      return {
        error: '已有相同的父元素跟路徑'
      }
    }
    return await this.dbService.put(data, this.tableName, id);
  }
  async create(data: CreateDto) {
    const hasSameParentAndRoute = await this.dbService.queryByRawSql(`
      select id
      from category
      where nav_id = ${data.nav_id} and route = '${data.route}';
    `)
    if (hasSameParentAndRoute.result.length > 0) {
      return {
        error: '已有相同的父元素跟路徑'
      }
    }
    return await this.dbService.create(data, this.tableName);
  }
}
