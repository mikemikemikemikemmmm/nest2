
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import { DetailPage } from './page/detail'
import { getProductCardDataOnNavIndexApi, getProductDetailByProductIdApi, getSeriesDataByRouteApi, SeriesData } from './api/get'
import { ProductListPage } from './page/list'
import { NavIndexPage } from './page/navIndex'
import { ErrorComponent } from './component/errorComponent'
import { errorHandler } from './errorHandler'
import { IndexPage } from './page'
import { store } from './store'
export const router = createHashRouter([
    {
        element: <ErrorComponent />,
        path: "error",
    },
    {
        // errorElement: <ErrorComponent />,
        element: <IndexPage />,
        path: "",
        loader: async ({ request, params }) => {
            return { navRoute: null }
        }
    },
    {
        errorElement: <ErrorComponent />,
        element: <DetailPage />,
        path: "detail/:productId",
        loader: async ({ request, params }) => {
            const productId = Number(params.productId)
            const [result, error] = await getProductDetailByProductIdApi(productId)
            if (error) {
                return errorHandler(error)
            }
            const data = result.data.result[0]
            return { data, navRoute: data.nav_route }
        }
    },
    {
        errorElement: <ErrorComponent />,
        element: <ProductListPage />,
        path: ":navRoute/:categoryRoute/:subcategoryRoute",
        loader: async ({ request, params }) => {
            const { navRoute, categoryRoute, subcategoryRoute } = params
            if (typeof navRoute !== 'string' || typeof categoryRoute !== "string" || typeof subcategoryRoute !== 'string') {
                return errorHandler('error')
            }
            const [result, error] = await getSeriesDataByRouteApi(navRoute, categoryRoute, subcategoryRoute)
            if (error) {
                return errorHandler(error)

            }
            return { data: result.data.result, navRoute }

        }
    },
    {
        errorElement: <ErrorComponent />,
        element: <NavIndexPage />,
        path: ":navRoute",
        loader: async ({ request, params }) => {
            const { navRoute } = params
            if (typeof navRoute !== 'string') {
                return errorHandler('error')
            }
            const [result, error] = await getProductCardDataOnNavIndexApi(navRoute as string)
            if (error) {
                return errorHandler(error)
            }
            return { data: result.data.result, navRoute }
        }
    },

]);