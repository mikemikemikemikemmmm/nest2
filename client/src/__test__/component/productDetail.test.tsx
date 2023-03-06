
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { ProductDetail } from "../../component/productDetail";
import { cleanup, render, waitFor, act, screen, prettyDOM, fireEvent } from '@testing-library/react'
import { DetailPage } from "../../page/detail";
import { ProductDetailData } from '../../api/get'
import { createRouterContainer } from '../util/createContainer'
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { detailQuerySpIdString } from '../../config';
const fakeData = {
    name: 'test',
    id: 1,
    series_id: 1,
    nav_route: "MEN",
    subproducts: [{
        id: 1,
        price: 222,
        color_id: 1,
        product_id: 2,
        color_name: 'testset',
        size_l: 1,
        size_m: 1,
        size_s: 2
    }]
} as ProductDetailData
const startPath = '/detail/1'
const routes = [
    {
        path: '/detail/1',
        element: <ProductDetail {...fakeData} />
    }
];

const router = createMemoryRouter(routes, {
    initialEntries: ["/", startPath],
    initialIndex: 1,
});
describe('test detail component', () => {
    afterEach(() => {
        cleanup()
    })
    it('render without error', async () => {
        const el = <RouterProvider router={router} />
        const { queryByTestId } = render(el)
        expect(queryByTestId('detailComponent')).toBeTruthy()
    })
    it('sizeBtn', async () => {
        const el = <RouterProvider router={router} />
        const { queryAllByTestId } = render(el)
        const sizeBtns = queryAllByTestId('detailComponent-sizeBtn')
        expect(sizeBtns.length).toBe(3)
        expect(sizeBtns[0].classList.contains('border-black')).toBeTruthy()
        expect(sizeBtns[1].classList.contains('border-black')).toBeFalsy()
        expect(sizeBtns[2].classList.contains('border-black')).toBeFalsy()
        fireEvent.click(sizeBtns[2])
        await waitFor(() => {
            expect(sizeBtns[0].classList.contains('border-black')).toBeFalsy()
            expect(sizeBtns[1].classList.contains('border-black')).toBeFalsy()
            expect(sizeBtns[2].classList.contains('border-black')).toBeTruthy()
        })
        fireEvent.click(sizeBtns[1])
        await waitFor(() => {
            expect(sizeBtns[0].classList.contains('border-black')).toBeFalsy()
            expect(sizeBtns[1].classList.contains('border-black')).toBeTruthy()
            expect(sizeBtns[2].classList.contains('border-black')).toBeFalsy()
        })
    })
    it('colorBtn', async () => {
        const _fakeData = {
            name: 'test',
            id: 1,
            series_id: 1,
            nav_route: "MEN",
            subproducts: [{
                id: 1,
                price: 222,
                color_id: 1,
                product_id: 2,
                color_name: 'test',
                size_l: 1,
                size_m: 1,
                size_s: 2
            }, {
                id: 2,
                price: 222,
                color_id: 3,
                product_id: 2,
                color_name: 'test3',
                size_l: 1,
                size_m: 1,
                size_s: 2
            },]
        } as ProductDetailData
        const startPath = '/detail/1'
        const routes = [
            {
                path: startPath,
                element: <ProductDetail {..._fakeData} />
            }
        ];
        const router = createMemoryRouter(routes, {
            initialEntries: ["/", startPath],
            initialIndex: 1,
        });
        const el = <RouterProvider router={router} />
        const { queryAllByTestId } = render(el)
        const colorBtns = queryAllByTestId('detailComponent-colorBtn')
        expect(colorBtns.length).toBe(_fakeData.subproducts.length)
        fireEvent.click(colorBtns[1])
        await waitFor(() => {
            expect(colorBtns[0].classList.contains('border-black')).toBeFalsy()
            expect(colorBtns[1].classList.contains('border-black')).toBeTruthy()
        })
        fireEvent.click(colorBtns[0])
        await waitFor(() => {
            expect(colorBtns[0].classList.contains('border-black')).toBeTruthy()
            expect(colorBtns[1].classList.contains('border-black')).toBeFalsy()
        })
    })
    it('colorBtn for seachparams', async () => {
        const _fakeData = {
            name: 'test',
            id: 1,
            series_id: 1,
            nav_route: "MEN",
            subproducts: [{
                id: 1,
                price: 222,
                color_id: 1,
                product_id: 2,
                color_name: 'test',
                size_l: 1,
                size_m: 1,
                size_s: 2
            }, {
                id: 2,
                price: 222,
                color_id: 3,
                product_id: 2,
                color_name: 'test3',
                size_l: 1,
                size_m: 1,
                size_s: 2
            },]
        } as ProductDetailData
        const routes = [
            {
                path: '/detail/1',
                element: <ProductDetail {..._fakeData} />
            }
        ];
        const router = createMemoryRouter(routes, {
            initialEntries: ["/", startPath + `?${detailQuerySpIdString}=2`],
            initialIndex: 1,
        });
        const el = <RouterProvider router={router} />
        const { queryAllByTestId } = render(el)
        const colorBtns = queryAllByTestId('detailComponent-colorBtn')
        expect(colorBtns[0].classList.contains('border-black')).toBeFalsy()
        expect(colorBtns[1].classList.contains('border-black')).toBeTruthy()
    })
})
