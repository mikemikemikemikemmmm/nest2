"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPutSqlSetStr = exports.isObj = exports.validDtoByStringfyJson = exports.sendResult = exports.sendError = exports.verityJWT = void 0;
const class_validator_1 = require("class-validator");
const verityJWT = (token) => {
};
exports.verityJWT = verityJWT;
const sendError = (error) => {
    if (typeof error === 'string') {
        return {
            error
        };
    }
    return {
        error: error.message
    };
};
exports.sendError = sendError;
const sendResult = (result) => {
    return {
        result
    };
};
exports.sendResult = sendResult;
const validDtoByStringfyJson = async (dto, json) => {
    Object.keys(json).forEach(key => {
        dto[key] = json[key];
    });
    try {
        await (0, class_validator_1.validateOrReject)(dto);
    }
    catch (error) {
        return (0, exports.sendError)(error);
    }
};
exports.validDtoByStringfyJson = validDtoByStringfyJson;
const isObj = (val) => {
    return typeof val === 'object' &&
        !Array.isArray(val) &&
        val !== null;
};
exports.isObj = isObj;
const createPutSqlSetStr = (data, excludeKeys = []) => {
    let str = '';
    Object.entries(data).forEach(item => {
        const key = item[0];
        const val = item[1];
        if (excludeKeys.includes(key)) {
            return;
        }
        str += `${key}=${typeof val === 'number' ? val : `'${val}'`} ,`;
    });
    str = str.substring(0, str.length - 1);
    return str;
};
exports.createPutSqlSetStr = createPutSqlSetStr;
//# sourceMappingURL=index.js.map