
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Nav } from '../../component/Nav';
import { fakeAllNavData } from '../util/fakeAllNavData';
import { NavState } from '../../store';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Aside } from '../../component/aside';
const createEl = (navRoute: string) => {
    const initialState = {
        allNavData: fakeAllNavData
    } as NavState
    const navSlice = createSlice({
        name: 'nav',
        initialState,
        reducers: {

        },
    })
    const store = configureStore({
        reducer: {
            navSlice: navSlice.reducer
        },
    })
    const routes = [
        {
            path: '/aside',
            element: <Aside />,
            loader: () => {
                return { navRoute }
            },
        },
        {
            path: '/',
            element: <div data-testid='asideComponent-error'></div>,
            loader: () => {
                return {}
            },
        },
    ];
    const router = createMemoryRouter(routes, {
        initialEntries: ["/aside"],
        initialIndex: 0,
    });
    return (
        <Provider store={store} >
            <RouterProvider router={router} />
        </Provider >)
}
describe('test aside component', () => {
    afterEach(() => {
        cleanup()
    })
    it('render without error', async () => {
        const { queryByTestId } = render(createEl(fakeAllNavData[0].route))
        await waitFor(() => {
            expect(queryByTestId('asideComponent')).toBeTruthy()
            expect(queryByTestId('asideComponent-error')).toBeNull()
        })
    })
    it('render with error', async () => {
        const { queryByTestId } = render(createEl('qwrwqr'))
        await waitFor(() => {
            expect(queryByTestId('asideComponent')).toBeNull()
            expect(queryByTestId('asideComponent-error')).toBeTruthy()
        })
    })
})
