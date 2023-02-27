import axios, { AxiosRequestConfig } from 'axios'
import { router } from '../App'
import { BASE_URL } from '../config'
import { pushAlertItem, setIsLoading, store } from '../store'
import { dispatchError, getErrorMessenge } from '../utils/errorHandler'
import { getToken } from '../utils/token'

type TErrorRes = {
    error: string,
    result: undefined
}
type TSelectRes<T> = {
    result: T
    error: undefined
} | TErrorRes
type TInsertRes = {
    result: unknown[]
    error: undefined
} | TErrorRes
type TDeleteRes = TInsertRes
type TUpdateRes = TInsertRes

export const baseApi = axios.create({
    baseURL: BASE_URL,

})
baseApi.interceptors.request.use((config) => {
    if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('token', getToken())
    }
    return config
})
baseApi.interceptors.response.use((response) => {
    return response
}, function (error) {
    if (error.response) {
        if (error.response.status === 401) {
            router.navigate('/')
        }
        return error.response
    }
})
export const getApi = async <DataType>(url: string, confing?: AxiosRequestConfig<any>) => {
    const _store = store
    const { dispatch } = _store
    dispatch(setIsLoading(true))
    const getStaffControllerPrefix = 'getStaffController'
    try {
        const res = await baseApi.get<TSelectRes<DataType>>(`/${getStaffControllerPrefix}/${url}`, confing)
        const data = res.data as TSelectRes<DataType>
        if (data.error) {
            throw Error(data.error)
        } else {
            pushAlertItem({ severity: 'success', text: `取得資料成功` })
            return { result: data.result, error: undefined }
        }
    } catch (error) {
        pushAlertItem({ severity: 'error', text: getErrorMessenge(error) })
        return { result: undefined, error: getErrorMessenge(error) }
    }
    finally {
        dispatch(setIsLoading(false))
    }
}
export const postApi = async<T>(url: string, _data: T, showText: string = "") => {
    const _store = store
    const { dispatch } = _store
    dispatch(setIsLoading(true))
    try {
        const res = await baseApi.post(url, _data)
        const data = res.data as TInsertRes
        if (data.error) {
            throw Error(data.error)
        } else {
            pushAlertItem({ severity: 'success', text: `${showText}新增成功` })
            return {
                result: data.result
            }
        }
    } catch (error) {
        pushAlertItem({ severity: 'error', text: getErrorMessenge(error) })
        return { result: undefined, error: getErrorMessenge(error) }

    }
    finally {
        dispatch(setIsLoading(false))
    }
}
export const putApi = async (url: string, _data: object, showText: string = "") => {
    const _store = store
    const { dispatch } = _store
    dispatch(setIsLoading(true))
    try {
        const res = await baseApi.put(url, _data)
        const data = res.data as TUpdateRes
        if (data.error) {
            throw Error(data.error)
        } else {
            pushAlertItem({ severity: 'success', text: `修改成功` })

        }
    } catch (error) {
        pushAlertItem({ severity: 'error', text: getErrorMessenge(error) })
        return { result: undefined, error: getErrorMessenge(error) }

    }
    finally {
        dispatch(setIsLoading(false))
    }
}
export const deleteApi = async (url: string, showText: string = "") => {
    const _store = store
    const { dispatch } = _store
    dispatch(setIsLoading(true))
    try {
        const res = await baseApi.delete(url)
        const data = res.data as TDeleteRes
        if (data.error) {
            throw new Error(data.error)
        } else {
            pushAlertItem({ severity: 'success', text: `${showText}刪除資料成功` })
            return { result: data.result }
        }
    } catch (error) {
        pushAlertItem({ severity: 'error', text: getErrorMessenge(error) })
        return { result: undefined, error: getErrorMessenge(error) }

    }
    finally {
        dispatch(setIsLoading(false))
    }
}