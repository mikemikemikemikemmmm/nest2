import { formdataKeyForData, formdataKeyForFile } from "../config";
import { SinglePartial } from "../type";
import { putApi } from "./base";
import { ResProductDataForDetailPage, ResSubProduct } from "./get";
import { CreateCategory, CreateColor, CreateNav, CreateProduct, CreateSeries, CreateSubCategory, CreateSubProduct } from "./post";

type base = {
    id: number
}
export type PutColor = Partial<CreateColor> & base
export type PutNav = Partial<CreateNav> & base
export type PutCategory = Partial<CreateCategory> & base
export type PutSubCategory = Partial<CreateSubCategory> & base
export type PutSeries = Partial<CreateSeries> & base

export type PutAllCategory = PutCategory | PutSubCategory | PutSeries | PutNav

export const putNavApi = (data: PutNav) => putApi(`nav/${data.id}`, data)
export const putCategoryApi = (data: PutCategory) => putApi(`category/${data.id}`, data)
export const putSubCategoryApi = (data: PutSubCategory) => putApi(`subCategory/${data.id}`, data)
export const putSeriesApi = (data: PutSeries) => putApi(`series/${data.id}`, data)

export type PutProduct = Partial<Omit<ResProductDataForDetailPage, "sub_products">> & { sub_products: PutSubproduct[] }
export type PutSubproduct = Partial<ResSubProduct>
export const putProductApi = (data: PutProduct) => {
    const copyData = {
        ...data, sub_products: data.sub_products.map(sp => {
            return { ...sp }
        })
    }
    const formData = new FormData()
    copyData.sub_products.forEach(sp => {
        if (sp.file) {
            formData.append(String(sp.color_id), sp.file)
            delete sp.file
        }
    })
    formData.append(formdataKeyForData, JSON.stringify(copyData))
    return putApi(`product/${data.id}`, formData)
}

export const putColorApi = (data: PutColor) => {

    const formData = new FormData()
    const _data = { ...data } as SinglePartial<typeof data, 'file'>
    if (data.file) {
        formData.append(formdataKeyForFile, data.file)
        delete _data.file
    }
    formData.append(formdataKeyForData, JSON.stringify(_data))
    return putApi(`color/${data.id}`, formData)
}