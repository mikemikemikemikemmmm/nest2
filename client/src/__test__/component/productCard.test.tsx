import { ProductDetail } from "../../component/productDetail";
import { cleanup, render, waitFor, act, fireEvent, screen } from '@testing-library/react'
import { DetailPage } from "../../page/detail";
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { ProductCardData, ProductDetailData } from '../../api/get'
import { createRouterContainer } from '../util/createContainer'
import { ProductCard } from "../../component/productCard";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { detailQuerySpIdString } from "../../config";
const fakeData = {
    name: 'test',
    id: 1,
    subproducts: [{
        price: 111,
        id: 2,
        color_id: 3,
        color_name: 'testtt'
    }, {
        price: 111,
        id: 3,
        color_id: 4,
        color_name: 'testtt'
    }]
} as ProductCardData

const routes = [
    {
        path: '/',
        element: <ProductCard {...fakeData} />
    }, {
        path: 'detail/:id',
        element: <div>12345</div>
    }
];
const router = createMemoryRouter(routes, {
    initialEntries: ["/"],
    initialIndex: 0,
});
describe('test product card component', () => {
    afterEach(() => {
        cleanup()
    })
    it('without error', () => {
        const el = <RouterProvider router={router} />
        const { queryByTestId } = render(el)
        expect(queryByTestId('productCard')).toBeTruthy()
    })
    it('test img link', () => {
        const el = <RouterProvider router={router} />
        const { queryByTestId } = render(el)
        const linkBtn = queryByTestId('productCard-link')
        expect(linkBtn).toBeTruthy()
        expect(linkBtn?.getAttribute('href')).toBe(`/detail/${fakeData.id}`)
    })
    it('test color link', () => {
        const el = <RouterProvider router={router} />
        const { queryAllByTestId } = render(el)
        const colorBtns = queryAllByTestId('productCard-colorBtn')
        expect(colorBtns.length).toBe(fakeData.subproducts.length)
        expect(colorBtns.map(el => el.getAttribute('href'))).toEqual(fakeData.subproducts.map(sp => `/detail/${fakeData.id}?${detailQuerySpIdString}=${sp.id}`))
    })
})
