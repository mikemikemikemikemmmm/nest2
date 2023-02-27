import { ClassConstructor } from "class-transformer"
import { validateOrReject } from "class-validator"
export const verityJWT = (token: string) => {

}
export const sendError = (error: Error | string) => {
    if (typeof error === 'string') {
        return {
            error
        }
    }
    return {
        error: error.message
    }
}
export const sendResult = (result: unknown) => {
    return {
        result
    }
}
export const validDtoByStringfyJson = async (dto: Object
    , json: object) => {
    Object.keys(json).forEach(key => {
        dto[key] = json[key]
    })
    try {
        await validateOrReject(dto);
    } catch (error) {
        return sendError(error)
    }

}

export const isObj = (val: object) => {
    return typeof val === 'object' &&
        !Array.isArray(val) &&
        val !== null
}
export const createPutSqlSetStr = (data: object, excludeKeys: string[] = []) => {
    let str = ''
    Object.entries(data).forEach(item => {
        const key = item[0]
        const val = item[1]
        if (excludeKeys.includes(key)) {
            return
        }
        str += `${key}=${typeof val === 'number' ? val : `'${val}'`} ,`
    })
    str = str.substring(0, str.length - 1);
    return str
}