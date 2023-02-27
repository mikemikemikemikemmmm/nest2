import { deleteApi } from "./base";

export const deleteColorApi = (id: number) => deleteApi(`color/${id}`)
export const deleteNavApi = (id: number) => deleteApi(`nav/${id}`)
export const deleteCategoryApi = (id: number) => deleteApi(`category/${id}`)
export const deleteSubCategoryApi = (id: number) => deleteApi(`subCategory/${id}`)
export const deleteSeriesApi = (id: number) => deleteApi(`series/${id}`)
export const deleteProductApi = (id: number) => deleteApi(`product/${id}`)
export const deleteSubProductApi = (id: number) => deleteApi(`subProduct/${id}`)