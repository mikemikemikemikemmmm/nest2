import { useEffect, useState } from "react"
import { useLoaderData, useParams } from "react-router-dom"
import { ProductCardData } from "../api/get"
import { Aside } from "../component/aside"
import { PageContainerWithNav } from "../component/PageContainerWithNav"
import { ProductCard } from "../component/productCard"

export const NavIndexPage = () => {
    const loaderData = useLoaderData() as { data: ProductCardData[] }
    const cardDatas = loaderData.data
    return (
        <PageContainerWithNav>
            <div className="flex">
                <Aside />
                {cardDatas.length === 0 ?
                    <div data-testid='no-data'>無資料</div> :
                    <div data-testid='datas'>
                        {cardDatas.map(card => <ProductCard key={card.id} {...card} />)}
                    </div>
                }
            </div>
        </PageContainerWithNav>
    )
}