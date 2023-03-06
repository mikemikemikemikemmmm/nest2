import { useEffect, useRef, useState, createElement } from "react"
import { Link } from "react-router-dom"
import { getColorImgUrlApi, getProductCardImgUrlApi, ProductCardData } from "../api/get"
import { detailQuerySpIdString } from "../config"
import { CARD_LAYOUT } from "../style/const"

export const ProductCard = (props: ProductCardData) => {
    const [status, setStatus] = useState<'error' | 'done'>('error')
    const firstSubproduct = props.subproducts[0]
    const imgUrl = getProductCardImgUrlApi(firstSubproduct?.id)
    const selfDom = useRef<HTMLDivElement>(null)
    const imgDom = <img src={imgUrl} onError={() => {
        if (selfDom.current) {
            selfDom.current.style.display = 'none'
        }
    }} />
    return (
        <div data-testid="productCard" ref={selfDom} className='inline-block relative' style={{ width: CARD_LAYOUT.WIDTH }}>
            <Link data-testid="productCard-link" to={`/detail/${props.id}`} style={{ display: 'block', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }} />
            <div className="my-1 flex items-center" style={{ height: CARD_LAYOUT.HEIGHT }}>
                {imgDom}
            </div>
            <div className="flex justify-center my-2">
                {
                    props.subproducts.map(sp => (
                        <Link data-testid='productCard-colorBtn' className="w-4 h-4 mx-1 inline-block border border-gray" style={{ zIndex: 200 }} to={`/detail/${props.id}?${detailQuerySpIdString}=${sp.id}`} key={sp.id}>
                            <img className="w-full h-full" src={getColorImgUrlApi(sp.color_id)} alt={sp.color_name} />
                        </Link>
                    ))
                }
            </div >
            <div className="my-1 text-center">{props.name}</div>
            <div className="my-1 text-center">${firstSubproduct.price}</div>
        </div>
    )
}