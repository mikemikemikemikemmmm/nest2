"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBService = void 0;
const sequelize_1 = require("sequelize");
const utils_1 = require("../utils");
class DBService {
    constructor(dbUrl) {
        this.dbUrl = dbUrl;
        this.sequelize = new sequelize_1.Sequelize(dbUrl);
    }
    async ensureConnect() {
        try {
            await this.sequelize.authenticate();
            console.log("Connection has been established successfully.");
        }
        catch (error) {
            console.error("Unable to connect to the database:", error);
        }
    }
    async queryByCustomizeRawSql(sqlStr) {
        try {
            const response = await this.sequelize.query(sqlStr, { logging: false });
            return { result: response };
        }
        catch (error) {
            return {
                error: error.message || '資料庫操作時發生錯誤'
            };
        }
    }
    async queryByRawSql(sqlStr, options) {
        try {
            const response = await this.sequelize.query(sqlStr, Object.assign(Object.assign({}, options), { logging: false }));
            const results = response[0];
            const metadata = response[1];
            if (typeof metadata === 'number') {
                if (metadata === 0) {
                    throw Error('沒有資料被新增');
                }
                return {
                    result: []
                };
            }
            const queryType = metadata.command;
            switch (queryType) {
                case sequelize_1.QueryTypes.DELETE: {
                    if (metadata.rowCount === 0) {
                        throw Error('沒有資料被刪除');
                    }
                    return {
                        result: []
                    };
                }
                case sequelize_1.QueryTypes.UPDATE: {
                    if (metadata.rowCount === 0) {
                        throw Error('沒有資料被更新');
                    }
                    return {
                        result: []
                    };
                }
                case sequelize_1.QueryTypes.SELECT:
                    return {
                        result: results,
                    };
            }
        }
        catch (error) {
            return (0, utils_1.sendError)(error);
        }
    }
    async hasSameValueByColName(colName, value, tableName, selfId) {
        const sql = `
      select ${colName}
      from ${tableName}
      where ${colName} = ${typeof value === 'number' ? value : `'${value}'`} 
        ${selfId ? `and id !=${selfId}` : ''}
    `;
        const { result, error } = await this.queryByRawSql(sql);
        if (error) {
            return (0, utils_1.sendError)(error);
        }
        return result.length > 0;
    }
    async hasChild(id, childTableName) {
        const parentColNameMap = {
            category: 'nav_id', series: 'sub_category_id', sub_category: 'category_id'
        };
        const sqlStr = `
      select id
      from ${childTableName}
      where ${parentColNameMap[childTableName]} = ${id}
    `;
        const { result, error } = await this.queryByRawSql(sqlStr);
        if (error) {
            return (0, utils_1.sendError)(error);
        }
        return result.length > 0;
    }
    async hasId(id, tableName) {
        return await this.hasSameValueByColName('id', id, tableName);
    }
    create(data, tableName) {
        const enties = Object.entries(data);
        const createColStr = (enties) => {
            let str = "";
            enties.forEach((e, i) => {
                str += `${e[0]},`;
                if (i === enties.length - 1) {
                    str = str.substring(0, str.length - 1);
                }
            });
            return str;
        };
        const createValueStr = (enties) => {
            let str = "";
            enties.forEach((e, i) => {
                const val = e[1];
                if (typeof val === "number") {
                    str += `${e[1]},`;
                }
                else {
                    str += `'${e[1]}',`;
                }
                if (i === enties.length - 1) {
                    str = str.substring(0, str.length - 1);
                }
            });
            return str;
        };
        const sqlStr = `
      insert into ${tableName} (${createColStr(enties)})
      values (${createValueStr(enties)})
    `;
        return this.queryByRawSql(sqlStr);
    }
    put(data, tableName, id, excludeKeys = []) {
        const enties = Object.entries(data);
        let setStr = "";
        enties.forEach((item, index) => {
            if (excludeKeys.includes(item[0])) {
                return;
            }
            setStr += `${item[0]} = ${typeof item[1] === "number" ? item[1] : `'${item[1]}'`} ,`;
        });
        setStr = setStr.substring(0, setStr.length - 1);
        const sqlStr = `
     update ${tableName}
     set ${setStr}
     where id = ${id}
    `;
        return this.queryByRawSql(sqlStr);
    }
    async delete(tableName, id) {
        const sqlStr = `
      delete from ${tableName}
      where id = ${id}
    `;
        return await this.queryByRawSql(sqlStr);
    }
}
exports.DBService = DBService;
//# sourceMappingURL=service.js.map