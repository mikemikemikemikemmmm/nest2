import { Injectable } from '@nestjs/common';
import { DBService } from 'src/core/db/service';
import { CreateDto, PutDto } from './dto';
import * as FS from 'fs'
import * as path from 'path'
import { sendError } from 'src/core/utils';
@Injectable()
export class ColorService {
  tableName: string;
  constructor(private dbService: DBService) {
    this.tableName = 'color';
  }
  async test(str: string) {
    return await this.dbService.queryByRawSql(str)
  }
  async delete(id: number) {
    const hasId = await this.dbService.hasId(id, this.tableName);
    if (!hasId) {
      return {
        error: '此ID不存在'
      }
    }
    const hasSubproductRefThisColor = await this.dbService.queryByRawSql(`
    select id
    from sub_product sp
    where sp.color_id =${id}
  `)
    if (hasSubproductRefThisColor.result.length > 0) {
      return { error: '有產品參考此顏色' }
    }
    const copyOrigin = await this.dbService.queryByRawSql(`
      select *
      from color
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
      const abosultePath = path.join(__dirname, '../', '../', '../', '../', 'public', 'colors', fileName)
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
  async put(id: number, data: PutDto, imageFile?: Express.Multer.File) { //TODO
    const hasId = await this.dbService.hasId(id, this.tableName);
    if (!hasId) {
      return {
        error: '此ID不存在'
      };
    }
    const hasSameValueByColName = await this.dbService.hasSameValueByColName('name', data.name, this.tableName)
    if (hasSameValueByColName && !imageFile) {
      return {
        error: '有相同名稱的顏色'
      }
    }
    const copyOrigin = await this.dbService.queryByRawSql(`
      select *
      from color
      where id = ${id}
    `)
    const executePut = await this.dbService.put(data, this.tableName, id)
    if (executePut.error || copyOrigin.error) {
      return {
        error: '修改時發生錯誤'
      }
    }
    if (imageFile) {
      try {
        const fileName = `${id}.jpg`
        const abosultePath = path.join(__dirname, '../', '../', '../', '../', 'public', 'colors', fileName)
        await FS.promises.writeFile(abosultePath, imageFile.buffer)
      } catch (error) {
        const originData = copyOrigin.result[0] as object
        const executeRecover = await this.dbService.put(originData, this.tableName, id)
        if (!executeRecover.error) {
          return {
            error: '修改時發生錯誤'
          }
        }
        return sendError(error || '上傳圖片失敗但已修改SQL')
      }
    }
    return {
      result: '修改成功'
    }

  }
  async create(data: CreateDto, file: Express.Multer.File) {//TODO
    const hasSameValueByColName = await this.dbService.hasSameValueByColName('name', data.name, this.tableName)
    if (hasSameValueByColName) {
      return {
        error: '有相同名稱的顏色'
      }
    }
    const createSql = `
      INSERT into color (name)
      values('${data.name}')
      returning id
      `
    const executeCreate = await this.dbService.queryByCustomizeRawSql(createSql)
    if (executeCreate.error) {
      return {
        error: executeCreate.error
      }
    }
    const newId = executeCreate.result[0][0]['id']
    const fileName = `${newId}.jpg`
    try {
      const abosultePath = path.join(__dirname, '../', '../', '../', '../', 'public', 'colors', fileName)
      await FS.promises.writeFile(abosultePath, file.buffer)
    } catch (error) {
      const deleteNewId = await this.dbService.delete(this.tableName, newId)
      if (deleteNewId.error) {
        return { error: ('上傳圖片失敗但已插入SQL資料，請手動刪除') }
      }
      return {
        error: "新增失敗"
      }
    }
    return {
      result: '新增顏色成功'
    }
  }
}
