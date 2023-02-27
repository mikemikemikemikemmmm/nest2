import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as FS from 'fs'

import { QueryTypes } from 'sequelize';
import { DBService } from 'src/core/db/service';
// import { CreateDto, ICreateProduct, PutDto } from './dto';
import { validateOrReject } from 'class-validator';
import e from 'express';
import { CreateDto, PutDto } from './dto';
import { createPutSqlSetStr } from 'src/core/utils';
import { TResponse } from 'src/type';
import { throwError } from 'rxjs';
import { CreateSubproductDto } from '../subProduct/dto';
@Injectable()
export class ProductService {
  tableName: string;
  constructor(private dbService: DBService) {
    this.tableName = 'product';
  }
  async delete(id: number) {
    const strForSubProduct = `
      select id
      from sub_product
      where product_id = ${id}
    `
    const productOfSubProduct = await this.dbService.queryByRawSql(strForSubProduct)
    if (productOfSubProduct.error) {
      return {
        error: productOfSubProduct.error
      }
    }
    const hasSubProduct = productOfSubProduct.result.length > 0
    if (hasSubProduct) {
      return {
        error: '不可刪除含有子產品的產品'
      }
    }
    const hasId = await this.dbService.hasId(id, this.tableName);
    if (!hasId) {
      return {
        error: '無此ID'
      }
    }
    return await this.dbService.delete(this.tableName, id);
  }
  async put(id: number, putProductData: PutDto, files: Array<Express.Multer.File>) { //TODO
    const hasId = this.dbService.hasId(id, this.tableName)
    if (!hasId) {
      return {
        error: '沒有此ID'
      }
    }
    const newSubproductArr = putProductData.sub_products.filter(sp => sp.id < 0) as CreateSubproductDto[]
    const putSubproductArr = putProductData.sub_products.filter(sp => sp.id > 0)
    const copyOriginProduct = await this.dbService.queryByRawSql(`
      select *
      from product
      where id = ${id}
    `).then(response => response.result[0]) as { id: number, series_id: number, sort: number, name: string }
    const copyOriginSubproduct = await (async () => {
      const promiseList = putSubproductArr.map(sp => new Promise((res, rej) => {
        const result = this.dbService.queryByRawSql(`
        select *
        from sub_product
        where id = ${sp.id}
      `)
        res(result)
      }))
      const getResponseList = await Promise.all(promiseList) as TResponse<any>[]
      return getResponseList.map(resultObj => resultObj.result[0])
    })() as { id: number, color_id: number, product_id: number, sort: number }[]
    const isProductEdited = Object.keys(putProductData).length > 2 //only id and sub_products
    const sqlStr = (() => {
      let str = `begin;\n`
      if (isProductEdited) {
        str += `update product\n`
        str += `set ${createPutSqlSetStr(putProductData, ['id', 'sub_products'])}\n`
        str += `where id = ${putProductData.id};\n`
      }
      putSubproductArr.forEach(sp => {
        if (Object.keys(sp).length <= 1) {
          return
        }
        str += `update sub_product\n`
        str += `set ${createPutSqlSetStr(sp, ['id', 'file'])}\n`
        str += `where id = ${sp.id};\n`
      })
      if (newSubproductArr.length > 0) {
        str += 'insert into sub_product(price,sort,color_id,product_id,size_s,size_m,size_l)\n'
        newSubproductArr.forEach(sp => {
          str += `values(${sp.price},${sp.sort},${sp.color_id},${sp.product_id},${sp.size_s},${sp.size_m},${sp.size_l})\n`
        })
        str += 'returning id,color_id ;\n'
      }
      str += 'end;'
      return str
    })()
    const putSql = await this.dbService.queryByCustomizeRawSql<{ id: number, color_id: number }[]>(sqlStr)
    if (putSql.error) {
      return {
        error: putSql.error
      }
    }
    const newSubproductResultArr = putSql.result[0]
    try {
      newSubproductResultArr.forEach(async (newSp) => {
        const targetFile = files.find(f => f.fieldname === String(newSp.color_id))
        if (!targetFile) {
          throw Error('')
        }
        const fileName = `${newSp.id}.jpg`
        const abosultePath = path.join(__dirname, '../', '../', '../', '../', 'public', 'subProducts', fileName)
        await FS.promises.writeFile(abosultePath, targetFile.buffer)
      })
      putSubproductArr.forEach(async (putSp) => {
        const targetFile = files.find(f => f.fieldname === String(putSp.color_id))
        if (!targetFile) {
          return
        }
        const fileName = `${putSp.id}.jpg`
        const abosultePath = path.join(__dirname, '../', '../', '../', '../', 'public', 'subProducts', fileName)
        await FS.promises.writeFile(abosultePath, targetFile.buffer)
      })
      return {
        result: '修改成功'
      }
    } catch {
      try {
        let recoverSql = 'begin;\n'
        if (isProductEdited) {
          recoverSql += 'update product\n'
          recoverSql += 'set \n'
          Object.keys(putProductData).forEach(key => {
            if (key === 'id' || key === 'sub_products') {
              return
            }
            const originVal = copyOriginProduct[key]
            recoverSql += `${key} = ${typeof originVal === 'number' ? originVal : `'${originVal}'`},`
          })
          recoverSql = recoverSql.substring(0, recoverSql.length - 1)
          recoverSql += `where id = ${putProductData.id};\n`
        }
        copyOriginSubproduct.forEach((originSp) => {
          const putSubproductData = putSubproductArr.find(putSp => putSp.id === originSp.id)
          if (!putSubproductData) {
            throw new Error("");
          }
          recoverSql += 'update sub_product\n'
          recoverSql += `set \n`
          Object.keys(putSubproductData).forEach(key => {
            if (key === 'id') {
              return
            }
            const originVal = originSp[key]
            recoverSql += `${key} = ${typeof originVal === 'number' ? originVal : `'${originVal}'`},`
          })
          recoverSql = recoverSql.substring(0, recoverSql.length - 1)
          recoverSql += '\n'
          recoverSql += `where id = ${originSp.id};\n`
        })
        newSubproductResultArr.forEach(async (sp) => {
          recoverSql += 'delete from sub_product\n'
          recoverSql += `where id = ${sp.id};\n`
        })
        recoverSql += 'end;'
        const execute = await this.dbService.queryByCustomizeRawSql(recoverSql)
        if (!execute.error) {
          return {
            error: '修改失敗'
          }
        }
        throw Error('')
      } catch (error) {
        return {
          error: '上傳圖片失敗但已修改SQL'
        }
      }
    }
  }
  async create(data: CreateDto) {
    return await this.dbService.create(data, this.tableName)
  }
}
