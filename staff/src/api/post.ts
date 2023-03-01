import { formdataKeyForData, formdataKeyForFile } from "../config";
import { SinglePartial } from "../type";
import { getErrorMessenge } from "../utils/errorHandler";
import { getToken } from "../utils/token";
import { baseApi, postApi } from "./base";
import { ResSubProduct } from "./get";

interface base {
    name: string
}

export interface CreateColor extends base {
    file: File
}
export const createColorAPi = (data: CreateColor) => {
    const formData = new FormData()
    formData.append(formdataKeyForFile, data.file)
    const _data = { ...data } as SinglePartial<typeof data, 'file'>
    delete _data.file
    formData.append(formdataKeyForData, JSON.stringify(_data))
    return postApi('color', formData)
}

export interface CreateNav {
    name: string
    sort: number,
    route: string
}
export const createNavAPi = (data: CreateNav) => postApi('nav', data)

export interface CreateCategory extends CreateNav {
    nav_id: number
}
export const createCategoryAPi = (data: CreateCategory) => postApi('category', data)

export interface CreateSubCategory extends CreateNav { category_id: number }
export const createSubCategoryAPi = (data: CreateSubCategory) => postApi('subCategory', data)

export interface CreateSeries {
    name: string
    sort: number,
    sub_category_id: number
}
export const createSeriesAPi = (data: CreateSeries) => postApi('series', data)

export interface CreateProduct extends base {
    sort: number,
    series_id: number,
}
export const createProductApi = <CreateProduct>(data: CreateProduct) => {
    return postApi('product', data)
}

export type CreateSubProduct = Omit<Required<ResSubProduct>, 'id'>
export const createSubproductApi = (data: CreateSubProduct) => {
    const formData = new FormData()
    formData.append(formdataKeyForFile, data.file)
    const _data = { ...data } as SinglePartial<typeof data, 'file'>
    delete _data.file
    formData.append(formdataKeyForData, JSON.stringify(_data))
    return postApi('subProduct', formData)
}
//auth
export const loginApi = (data: { password: string, name: string }) => baseApi.post('authController/login', data)
    .then(res => {
        if (res.data.error) {
            throw Error(res.data.error)
        } else {
            return {
                result: res.data.result,
                error: undefined
            }
        }
    }).catch(error => {
        return { result: undefined, error: getErrorMessenge(error) }
    })
export const testTokenApi = async () => await baseApi.post(`authController/testToken?temp=${performance.now()}`)
    .then(res => {
        if (res.data.error) {
            throw Error(res.data.error)
        } else {
            return {
                error: undefined,
                result: res.data.result
            }
        }
    }).catch(error => {
        return { result: undefined, error: getErrorMessenge(error) }
    })