import { configureStore, createSlice, Dispatch } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
type AlertSeverity = 'error' | 'warning' | 'info' | 'success'
export interface IAlertItem { severity: AlertSeverity, text: string, id?: number }
export interface IState {
    isLoading: boolean
    alertList: IAlertItem[]
}

const initialState: IState = {
    isLoading: false,
    alertList: []
}

export const appSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            if (state.isLoading === action.payload) {
                return
            }
            state.isLoading = action.payload
        },
        _pustAlertListSingleItem: (state, action: PayloadAction<IAlertItem>) => {
            state.alertList = [...state.alertList, action.payload]
        },
        shiftAlertListItem: (state) => {
            if (state.alertList.length > 0) {
                const copy = [...state.alertList]
                copy.shift()
                state.alertList = copy
            }
        },
        deleteAlertListItemById: (state, action: PayloadAction<number>) => {
            const targetIndex = state.alertList.findIndex(a => a.id === action.payload)
            if (targetIndex !== -1) {
                const newList = [...state.alertList]
                newList.splice(targetIndex)
                state.alertList = newList
            }
        }
    },
})

export const { setIsLoading, _pustAlertListSingleItem, shiftAlertListItem, deleteAlertListItemById } = appSlice.actions
export default appSlice.reducer

export const store = configureStore({
    reducer: {
        appSlice: appSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
/**
 * ---------------------------------------------------------------------------
 */
//methods
export const pushAlertItem = (alertData: IAlertItem) => {
    const _store = store
    const { dispatch } = _store
    const state = _store.getState()
    const { alertList } = state.appSlice
    if (alertList.length >= 6) {
        dispatch(shiftAlertListItem())
    }
    let _alertData = { ...alertData, id: performance.now() }
    dispatch(_pustAlertListSingleItem(_alertData))
    setTimeout(() => {
        dispatch(deleteAlertListItemById(_alertData.id as number))
    }, 7000)
}
/**
 * ---------------------------------------------------------------------------
 */