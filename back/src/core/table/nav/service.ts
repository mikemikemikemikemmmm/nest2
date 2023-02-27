import { Injectable } from '@nestjs/common';
import path from 'path';
import { DBService } from 'src/core/db/service';
import { TResponse } from 'src/type';
import { CreateDto, PutDto } from './dto';
import * as FS from 'fs'
@Injectable()
export class NavService {
  tableName: string;
  constructor(private dbService: DBService) {
    this.tableName = 'nav';
  }
  async hasChild(id: number) {
    const sql = `
      select id 
      from category c
      where c.nav_id =${id}
    `
    const result = await this.dbService.queryByRawSql(sql)
    return result.result.length > 0
  }
  async delete(id: number): Promise<TResponse<any>> {
    const hasChild = await this.hasChild(id);
    if (hasChild) {
      return {
        error: '不能刪除含有子元素的類別'
      }
    }
    const hasId = await this.dbService.hasId(id, this.tableName);
    if (!hasId) {
      return {
        error: '此ID不存在'
      }
    }
    const deleteRes = await this.dbService.delete(this.tableName, id);
    return {
      result: deleteRes.result
    }
  }
  async put(id: number, data: PutDto) {
    const hasId = await this.dbService.hasId(id, this.tableName);
    if (!hasId) {
      return {
        error: '此ID不存在'
      }
    }
    const hasSameRoute = await this.dbService.hasSameValueByColName('route', data.route, this.tableName, id)
    if (hasSameRoute) {
      return {
        error: '已有相同路徑'
      }
    }
    const hasSameName = await this.dbService.hasSameValueByColName('name', data.name, this.tableName, id)
    if (hasSameName) {
      return {
        error: '已有相同名稱'
      }
    }
    return this.dbService.put(data, this.tableName, id);
  }
  async create(data: CreateDto) {
    const hasSameRoute = await this.dbService.hasSameValueByColName('route', data.route, this.tableName)
    if (hasSameRoute) {
      return {
        error: '已有相同路徑'
      }
    }
    const hasSameName = await this.dbService.hasSameValueByColName('name', data.name, this.tableName)
    if (hasSameName) {
      return {
        error: '已有相同名稱'
      }
    }
    return this.dbService.create(data, this.tableName);
  }

  async putImg(id: number, file: Express.Multer.File) {
    const hasId = await this.dbService.hasId(id, this.tableName);
    if (!hasId) {
      return {
        error: '此ID不存在'
      };
    }

    try {
      const fileName = `${id}.jpg`
      const abosultePath = path.join(__dirname, '../', '../', '../', '../', 'public', 'nav', fileName)
      await FS.promises.writeFile(abosultePath, file.buffer)
    } catch (error) {
      return {
        error: '上傳圖片失敗'
      }
    }
    return {
      result: '修改成功'
    }
  }
}
