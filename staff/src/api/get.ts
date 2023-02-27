import { BASE_URL, serverStaticPrefix } from "../config";
import { getApi } from "./base";

//colorPage
export interface ResColor {
    id: number,
    name: string
}
export const getAllColorsApi = () => getApi<ResColor[]>("getAllColorsApi")
export const getColorsBySearchNameApi = (name: string) => getApi<ResColor[]>(`getColorsBySearchNameApi/${name}`)
export const getColorImageUrlApi = (colorId: number, timestamp: number) => {
    return `${BASE_URL}/${serverStaticPrefix}/colors/${colorId}.jpg?timestamp=${timestamp}`
}
export const getProductCardDataByColorIdApi = (colorId: number) => getApi<ResProductCard[]>(`getProductCardDataByColorIdApi/${colorId}`)
//navPage
export interface ResNav {
    id: number,
    name: string,
    sort: number,
    route: string,
    type: 'nav',
    children: ResCategory[]
}
export interface ResCategory {
    id: number,
    name: string,
    sort: number,
    route: string,
    nav_id: number,
    type: 'category',
    children: ResSubcategory[]
}
export interface ResSubcategory {
    id: number,
    name: string,
    sort: number,
    route: string,
    category_id: number,
    type: 'subCategory',
    children: ResSeries[]
}
export interface ResSeries {
    id: number,
    name: string,
    sort: number,
    sub_category_id: number,
    type: 'series',
    children?: any[]
}
export type ResAllCategoryType = ResCategory | ResNav | ResSubcategory | ResSeries
export const getAllNavDataForCategoryPageApi = () => getApi<ResNav[]>("getAllNavDataForCategoryPageApi")

export interface ResProductCard {
    id: number,
    name: string,
    first_subproduct_id: number
}
export const getProductCardDataBySeriesIdApi = (series_id: number) => getApi<ResProductCard[]>(`getProductCardDataBySeriesIdApi/${series_id}`)
//ProductPage
export const getProductBySearchNameApi = (name: string) => getApi<ResProductCard[]>(`getProductBySearchNameApi/${name}`)
export const getProductsForProductPageApi = () => getApi<ResProductCard[]>(`getProductsForProductPageApi`)


//DetailPage
export interface ResSubProduct {
    product_id: number
    id: number,
    sort: number,
    price: number,
    color_id: number,
    size_s: number,
    size_m: number
    size_l: number,
    file?: File,
}
export interface ResProductDataForDetailPage {
    id: number,
    name: string,
    series_id: number | '',
    sort: number,
    series_name: string,
    sub_products: ResSubProduct[]
}
export interface ResSeriesForDetailPage {
    id: number,
    name: string,
}
export interface ResDetailInit {
    colors: ResColor[],
    series: ResSeriesForDetailPage[],
    product: ResProductDataForDetailPage[]
}
export const getImgUrlBySubProductIdApi = (subProductId: number) => `${BASE_URL}/${serverStaticPrefix}/subProducts/${subProductId}.jpg`
export const getProductDetailDataByProductIdApi = (productId: number) => getApi<ResDetailInit>(`getProductDetailDataByProductIdApi/${productId}`)
export const getSeriesDataForCreateProductApi = () => getApi<ResSeriesForDetailPage[]>(`getSeriesDataForCreateProductApi`)
export const getProductIdBySeriesIdAndNameApi = (seriesId: number, name: string) => getApi<{ id: number }[]>(`getProductIdBySeriesIdAndNameApi/${seriesId}/${name}`)//TODO