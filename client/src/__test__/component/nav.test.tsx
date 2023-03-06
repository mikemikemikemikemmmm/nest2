
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Nav } from '../../component/Nav';
import { fakeAllNavData } from '../util/fakeAllNavData';
import { NavState } from '../../store';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
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
        path: '/',
        element: <Nav />,
        loader: () => {
            return { navRoute: fakeAllNavData[1].route }
        },
    },
];

const router = createMemoryRouter(routes, {
    initialEntries: ["/"],
    initialIndex: 0,
});
const el = (
    <Provider store={store} >)
        <RouterProvider router={router} />
    </Provider >)
describe('test nav component', () => {
    afterEach(() => {
        cleanup()
    })
    it('render without error', async () => {
        const { queryByTestId } = render(el)
        expect(queryByTestId('navComponent')).toBeTruthy()
    })
    it('test link btn', async () => {
        const { queryAllByTestId } = render(el)
        const linkBtns = queryAllByTestId('navComponent-linkBtn')
        expect(linkBtns.length).toBe(fakeAllNavData.length)
        expect(linkBtns[0].style.backgroundColor).toBe('white')
        expect(linkBtns[1].style.backgroundColor).not.toBe('white')
    })
})
