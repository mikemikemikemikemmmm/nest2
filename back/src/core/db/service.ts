import {
  QueryOptions,
  QueryOptionsWithType,
  QueryTypes,
  Sequelize,
} from "sequelize";
import { TResponse } from "src/type";
import { sendError } from "../utils";
export class DBService {
  sequelize: Sequelize;
  constructor(readonly dbUrl: string) {
    this.sequelize = new Sequelize(dbUrl);
  }
  async ensureConnect() {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
  async queryByCustomizeRawSql<T>(sqlStr: string) {
    try {
      const response = await this.sequelize.query(sqlStr, { logging: false })
      return { result: response as [T, unknown[]] }
    }
    catch (error) {
      return {
        error: error.message || '資料庫操作時發生錯誤'
      }
    }
  }
  async queryByRawSql<T>(
    sqlStr: string,
    options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW>
  ): Promise<TResponse<T>> {
    try {
      const response = await this.sequelize.query(sqlStr, { ...options, logging: false })
      const results = response[0] as T[]
      const metadata = response[1] as { rowCount: number, command: QueryTypes } | number
      /**  update
       * [
          [],
          Result {
            command: 'UPDATE',
            rowCount: 1,
            oid: null,
            rows: [],
            fields: [],
            _parsers: undefined,
            _types: TypeOverrides { _types: [Object], text: {}, binary: {} },
            RowCtor: null,
            rowAsArray: false
          }
        ]
      */

      /**  delete
         [
           [],
           Result {
             command: 'DELETE',
             rowCount: 1,
             oid: null,
             rows: [],
             fields: [],
             _parsers: undefined,
             _types: TypeOverrides { _types: [Object], text: {}, binary: {} },
             RowCtor: null,
             rowAsArray: false
           }
         ]
       */

      /**  insert
       * [[],number(insert row count)]
       */
      if (typeof metadata === 'number') {
        if (metadata === 0) {
          throw Error('沒有資料被新增')
        }
        return {
          result: []
        }
      }
      const queryType = metadata.command
      switch (queryType) {
        case QueryTypes.DELETE: {
          if (metadata.rowCount === 0) {
            throw Error('沒有資料被刪除')
          }
          return {
            result: []
          }
        }
        case QueryTypes.UPDATE: {
          if (metadata.rowCount === 0) {
            throw Error('沒有資料被更新')
          }
          return {
            result: []
          }
        }
        case QueryTypes.SELECT:
          return {
            result: results,
          }
      }
    } catch (error) {
      return sendError(error)
    }
  }
  async hasSameValueByColName(colName: string, value: string | number, tableName: string, selfId?: number) {
    const sql = `
      select ${colName}
      from ${tableName}
      where ${colName} = ${typeof value === 'number' ? value : `'${value}'`} 
        ${selfId ? `and id !=${selfId}` : ''}
    `
    const { result, error } = await this.queryByRawSql(sql)
    if (error) {
      return sendError(error)
    }
    return result.length > 0
  }
  async hasChild(
    id: number,
    childTableName: "category" | "series" | "sub_category"
  ) {
    const parentColNameMap = {
      category: 'nav_id', series: 'sub_category_id', sub_category: 'category_id'
    }
    const sqlStr = `
      select id
      from ${childTableName}
      where ${parentColNameMap[childTableName]} = ${id}
    `;
    const { result, error } = await this.queryByRawSql(sqlStr);
    if (error) {
      return sendError(error)
    }
    return (result as unknown[]).length > 0;
  }
  async hasId(id: number, tableName: string) {
    return await this.hasSameValueByColName('id', id, tableName);
  }
  create(data: object, tableName: string) {
    const enties = Object.entries(data);
    const createColStr = (enties) => {
      let str = "";
      enties.forEach((e, i) => {
        str += `${e[0]},`;
        if (i === enties.length - 1) {
          str = str.substring(0, str.length - 1);
        }
      });
      return str
    };
    const createValueStr = (enties) => {
      let str = "";
      enties.forEach((e, i) => {
        const val = e[1];
        if (typeof val === "number") {
          str += `${e[1]},`;
        } else {
          str += `'${e[1]}',`;
        }
        if (i === enties.length - 1) {
          str = str.substring(0, str.length - 1);
        }
      });
      return str
    };
    const sqlStr = `
      insert into ${tableName} (${createColStr(enties)})
      values (${createValueStr(enties)})
    `;
    return this.queryByRawSql(sqlStr);
  }
  put(data: object, tableName: string, id: number, excludeKeys: string[] = []) {
    const enties = Object.entries(data);
    let setStr = "";
    enties.forEach((item, index) => {
      if (excludeKeys.includes(item[0])) {
        return
      }
      setStr += `${item[0]} = ${typeof item[1] === "number" ? item[1] : `'${item[1]}'`} ,`;
    });
    setStr = setStr.substring(0, setStr.length - 1);
    const sqlStr = `
     update ${tableName}
     set ${setStr}
     where id = ${id}
    `;
    return this.queryByRawSql(sqlStr)
  }
  async delete(tableName: string, id: number) {
    const sqlStr = `
      delete from ${tableName}
      where id = ${id}
    `;
    return await this.queryByRawSql(sqlStr)
  }
}
