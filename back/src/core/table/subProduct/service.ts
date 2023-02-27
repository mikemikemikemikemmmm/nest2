import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as FS from 'fs'
import { DBService } from 'src/core/db/service';
@Injectable()
export class SubProductService {
  tableName: string;
  constructor(private dbService: DBService) {
    this.tableName = 'sub_product';
  }
  async delete(id: number) {
    const hasId = await this.dbService.hasId(id, this.tableName);
    if (!hasId) {
      return { error: '沒有此ID' }
    }
    const copyOrigin = await this.dbService.queryByRawSql(`
      select *
      from sub_product
      where id = ${id}
    `)
    const executeDelete = await this.dbService.delete(this.tableName, id)
    if (executeDelete.error || copyOrigin.error) {
      return {
        error: executeDelete.error || copyOrigin.error
      }
    };
    try {
      const fileName = `${id}.jpg`
      const abosultePath = path.join(__dirname, '../', '../', '../', '../', 'public', 'subProducts', fileName)
      await FS.promises.unlink(abosultePath);
    } catch (error) {
      const executeRecover = await this.dbService.create(copyOrigin.result[0] as object, this.tableName)
      if (executeRecover.error) {
        return {
          error: '刪除圖片時失敗'
        }
      }
      return {
        error: '刪除圖片時失敗且已刪除sql'
      }
    }
    return {
      result: '刪除成功'
    }
  }
}
