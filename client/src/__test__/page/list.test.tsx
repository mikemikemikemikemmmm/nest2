
import { cleanup, render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { ProductCardData, SeriesData } from '../../api/get'
import { ProductListPage } from '../../page/list'
import { NavIndexPage } from '../../page/navIndex'
import { createRouterContainer } from '../util/createContainer'
describe('test product list page', () => {
    afterEach(() => {
        cleanup()
    })
    it('with series data', async () => {
        const el = createRouterContainer({
            el: <ProductListPage />,
            loaderData: { data: [{ id: 2, name: 'test', products: [] }] as SeriesData[] },
        })
        const { queryByTestId } = render(el)
        await waitFor(() => {
            expect(queryByTestId('productlistpage-nodata')).toBeNull()
            expect(queryByTestId('productlistpage-data')).toBeTruthy()
        })
    })
    it('with no series data', async () => {
        const el = createRouterContainer({
            el: <ProductListPage />,
            loaderData: { data: [] as SeriesData[] },
        })
        const { queryByTestId } = render(el)
        await waitFor(() => {
            expect(queryByTestId('productlistpage-nodata')).toBeTruthy()
            expect(queryByTestId('productlistpage-data')).toBeNull()
        })
    })
})