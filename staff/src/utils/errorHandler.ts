import { ResSubProduct } from "../api/get"
import { pushAlertItem, store } from "../store"
export const dispatchError = (error: string | Error | undefined | unknown) => {
    const messenge = getErrorMessenge(error)
    pushAlertItem({ severity: 'error', text: messenge })
}
export const dispatchSuccess = (messenge: string) => {
    pushAlertItem({ severity: 'success', text: messenge })
}
export const getErrorMessenge = (error: unknown) => {
    if (error instanceof Error) {
        return error.message
    } else if (typeof error === 'string') {
        return error
    } else {
        return '發生錯誤'
    }
}
export type ValidData<T> = { [K in keyof T]: { validFn: (arg: T[K]) => boolean, errorMessenge: string } }
export const isValidInput = <T extends object>(inputData: T, validData: ValidData<T>) => {
    const keys = Object.keys(inputData) as (keyof T)[]
    return keys.every(key => {
        const value = inputData[key]
        const targetValidData = validData[key]
        if (!value || !targetValidData) {
            return true
        }
        const { validFn, errorMessenge } = targetValidData
        if (!validFn(value)) {
            dispatchError(errorMessenge)
            return false
        }
        return true
    })
}

export const isNewSubproduct = (subproductData: ResSubProduct) => {
    return subproductData.id < 0
}