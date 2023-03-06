import { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom"
import { ProductDetailData } from "../api/get"
import { Aside } from "../component/aside"
import { PageContainerWithNav } from "../component/PageContainerWithNav"
import { ProductDetail } from "../component/productDetail"

export const DetailPage = () => {
    const loaderData = useLoaderData() as { data: ProductDetailData }
    return (
        <PageContainerWithNav>
            <div className="flex" data-testid='detail-page'>
                <Aside />
                <ProductDetail {...loaderData.data} />
            </div>
        </PageContainerWithNav>
    )
}