import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { DetailPage } from "../../page/detail";
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { ProductCardData, ProductDetailData, SeriesData } from '../../api/get'
import { ProductListPage } from '../../page/list'
import { NavIndexPage } from '../../page/navIndex'
import { createRouterContainer } from '../util/createContainer'
describe('test detail page', () => {
    afterEach(() => {
        cleanup()
    })
    it('render without error', async () => {
        const fakeDetailData = {
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
        const el = createRouterContainer({
            el: <DetailPage />,
            loaderData: { data: fakeDetailData },
            startPath: `/detail/${fakeDetailData.id}`
        })
        const { queryByTestId } = render(el)
        await waitFor(() => {
            expect(queryByTestId('detail-page')).toBeTruthy()
        })
    })
})
