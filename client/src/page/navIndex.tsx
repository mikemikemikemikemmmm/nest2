import { useEffect, useState } from "react"
import { useLoaderData, useParams } from "react-router-dom"
import { ProductCardData } from "../api/get"
import { Aside } from "../component/aside"
import { PageContainer } from "../component/PageContainer"
import { ProductCard } from "../component/productCard"

export const NavIndexPage = () => {
    const loaderData = useLoaderData() as { data: ProductCardData[] }
    const cardDatas = loaderData.data
    return (
        <PageContainer>
            <div className="flex">
                <Aside />
                {cardDatas.length === 0 ?
                    <div>無資料</div> :
                    <div>
                        {cardDatas.map(card => <ProductCard key={card.id} {...card} />)}
                    </div>
                }
            </div>
        </PageContainer>
    )
}