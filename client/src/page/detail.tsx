import { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom"
import { ProductDetailData } from "../api/get"
import { Aside } from "../component/aside"
import { PageContainer } from "../component/PageContainer"
import { ProductDetail } from "../component/productDetail"

export const DetailPage = () => {
    const loaderData = useLoaderData() as { data: ProductDetailData }
    return (
        <PageContainer>
            <div className="flex">
                <Aside />
                <ProductDetail {...loaderData.data} />
            </div>
        </PageContainer>
    )
}