import { baseApi } from "./base"
import { AxiosResponse } from 'axios'
import { BASE_URL, serverStaticPrefix } from "../config"
type GetRes<T> = [AxiosResponse<{ result: T }>, undefined] | [undefined, Error]
const getApi = async <T>(url: string): Promise<GetRes<T>> => {
    try {
        const result = await baseApi.get<{ result?: T, error?: string }>(`getClientController/${url}`)
        if (result.data.error || !result.data.result) {
            throw Error(result.data.error)
        }
        return [result as AxiosResponse<{ result: T }>, undefined]
    } catch (error) {
        return [undefined, error as Error]
    }
}

///nav component
export interface NavData {
    id: number,
    name: string,
    route: string
    children: {
        id: number,
        nav_id: number,
        name: string,
        route: string
        children: {
            category_id: number,
            id: number,
            name: string,
            route: string
            children: {
                sub_category_id: number,
                id: number,
                name: string,
            }[]
        }[]
    }[]
}
export const getAllNavApi = () => getApi<NavData[]>('getAllNavApi')
export const getNavRouteByProductIdApi = (productId: number) => getApi<string>(`getNavRouteOnDetailPageApi/${productId}`)


///nav index page
export interface ProductCardData {
    name: string,
    id: number,
    subproducts: {
        price: number,
        id: number,
        color_id: number,
        color_name: string
    }[]
}
export const getProductCardDataOnNavIndexApi = (navRoute: string) => getApi<ProductCardData[]>(`getProductCardDataOnNavIndexApi/${navRoute}`)

///product list page
export interface SeriesData {
    id: number,
    name: string,
    products: ProductCardData[]
}
export const getSeriesDataByRouteApi = (navRoute: string, categoryRoute: string, subcategoryRoute: string) => getApi<SeriesData[]>(`getSeriesDataByRouteApi/${navRoute}/${categoryRoute}/${subcategoryRoute}`)

/// product detail page
export interface ProductDetailData {
    name: string,
    id: number,
    series_id: number,
    nav_route: string,
    subproducts: {
        id: number,
        price: number,
        color_id: number,
        product_id: number,
        color_name: string,
        size_l: number,
        size_m: number,
        size_s: number
    }[]
}
export const getProductDetailByProductIdApi = (productId: number) => getApi<[ProductDetailData]>(`getProductDetailByProductIdApi/${productId}`)

//img 
export const getProductCardImgUrlApi = (subproductId: number) => `${BASE_URL}/${serverStaticPrefix}/subProducts/${subproductId}.jpg`
export const getSubproductImgUrlInDetailPageApi = (subproductId: number) => `${BASE_URL}/${serverStaticPrefix}/subProducts/${subproductId}.jpg`
export const getNavBannerImgUrlApi = (navRoute: string) => `${BASE_URL}/${serverStaticPrefix}/nav/${navRoute}.jpg`
export const getColorImgUrlApi = (colorId: number) => `${BASE_URL}/${serverStaticPrefix}/colors/${colorId}.jpg`