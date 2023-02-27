import { useEffect, useState } from "react"
import { useLoaderData, useParams } from "react-router-dom"
import { SeriesData } from "../api/get"
import { Aside } from "../component/aside"
import { PageContainer } from "../component/PageContainer"
import { ProductCard } from "../component/productCard"
export const ProductListPage = () => {
    const loaderData = useLoaderData() as { data: SeriesData[] }
    const seriesDatas = loaderData.data
    return (
        <PageContainer>
            <div className="flex">
                <Aside />
                {seriesDatas.length === 0 ?
                    <div className=" text-center">無資料</div> :
                    <ul>
                        {seriesDatas.map(series => <li key={series.id}>
                            <div>{series.name}</div>
                            <div className="flex">
                                {series.products.map(card =>
                                    <ProductCard key={card.id} {...card} />
                                )}
                            </div>
                        </li>)}
                    </ul>
                }
            </div>
        </PageContainer>
    )
}