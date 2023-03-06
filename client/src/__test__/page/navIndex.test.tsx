
import { cleanup, render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { ProductCardData } from '../../api/get'
import { NavIndexPage } from '../../page/navIndex'
import { createRouterContainer } from '../util/createContainer'
describe('test navIndex page', () => {
    afterEach(() => {
        cleanup()
    })
    it('with no card data', async () => {
        const el = createRouterContainer({
            el: <NavIndexPage />,
            loaderData: { data: [] },
        })
        const { queryByTestId } = render(el)
        await waitFor(() => {
            expect(queryByTestId('no-data')).toBeTruthy()
            expect(queryByTestId('datas')).toBeNull()
            expect(queryByTestId('productCard')).toBeNull()
        })
    })
    it('with card data', async () => {
        const fakeCardData = [{
            name: 'test',
            id: 1,
            subproducts: [{
                price: 124,
                id: 2,
                color_id: 1,
                color_name: 'test'
            }]
        }] as ProductCardData[]
        const el = createRouterContainer({
            el: <NavIndexPage />,
            loaderData: { data: fakeCardData },
        })
        const { queryByTestId } = render(el)
        await waitFor(() => {
            expect(queryByTestId('no-data')).toBeNull()
            expect(queryByTestId('datas')).toBeTruthy()
            expect(queryByTestId('productCard')).toBeTruthy()
        })
    })
})