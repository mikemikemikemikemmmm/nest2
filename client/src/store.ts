import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { NavData } from './api/get'

export interface NavState {
    allNavData: NavData[],
}

const initialState = {
    allNavData: [],
} as NavState

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setAllNavData: (state, action: PayloadAction<NavData[]>) => {
            state.allNavData = action.payload
        },
    },
})

export const { setAllNavData } = navSlice.actions

export const store = configureStore({
    reducer: {
        navSlice: navSlice.reducer
    },
})
export default navSlice.reducer
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch