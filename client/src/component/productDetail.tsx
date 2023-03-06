import { isAllOf } from '@reduxjs/toolkit'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getColorImgUrlApi, getProductDetailByProductIdApi, getSubproductImgUrlInDetailPageApi, ProductDetailData } from '../api/get'
import { detailQuerySpIdString } from '../config'
import { errorHandler } from '../errorHandler'
import { APP_WIDTH, ASIDE_WIDTH } from '../style/const'
type Size = 'S' | 'M' | 'L'
export const ProductDetail = (props: ProductDetailData) => {
    const { id, series_id, subproducts, name, nav_route } = props
    const targetSpIdByQuery = useSearchParams()[0].get(detailQuerySpIdString)
    const [selectedSubproduct, setSelectedSubproduct] = useState(() => {
        if (targetSpIdByQuery) {
            const target = subproducts.find(sp => sp.id === Number(targetSpIdByQuery))
            if (!target) {
                return subproducts[0]
            } else {
                return target
            }
        } else {
            return subproducts[0]
        }
    })
    const [selectedSize, setSelectedSize] = useState<Size>('S')
    const handleSelectSize = (size: Size) => {
        setSelectedSize(size)
    }
    const handleSelectSubproduct = (subproductId: number) => {
        const target = subproducts.find(sub => sub.id === subproductId)
        if (!target) {
            return errorHandler('error')
        }
        setSelectedSubproduct(target)
    }
    return (
        <div data-testid='detailComponent' style={{
            width: APP_WIDTH - ASIDE_WIDTH
        }}>
            <div className="inline-block w-1/2 align-top">
                <img src={getSubproductImgUrlInDetailPageApi(selectedSubproduct.id)} alt={name} />
            </div>
            <div className="inline-block w-1/2 align-top">
                <div className='my-2'>
                    <span className='inline-block'>{`${name} (${selectedSubproduct.color_name})`}</span>
                    <span className='inline-block ml-4'>${selectedSubproduct.price}</span>
                </div>
                <div className='my-2'>
                    {subproducts.map(sub => (
                        <button
                            data-testid='detailComponent-colorBtn'
                            onClick={() => handleSelectSubproduct(sub.id)}
                            className={`w-6 h-6 mr-2 p-1 border ${selectedSubproduct.id === sub.id ? 'border-black' : 'border-white'}`}
                            key={sub.id}
                        >
                            <img src={getColorImgUrlApi(sub.color_id)} alt={sub.color_name} />
                        </button>
                    ))}
                </div>
                <div className="my-2">
                    <button data-testid='detailComponent-sizeBtn' className={`py-2  px-7 mr-3 bg-slate-200 border ${selectedSize === 'S' ? 'border-black' : 'border-white'}`} onClick={() => handleSelectSize('S')}>S</button>
                    <button data-testid='detailComponent-sizeBtn' className={`py-2 px-7 mr-3 bg-slate-200 border ${selectedSize === 'M' ? 'border-black' : 'border-white'}`} onClick={() => handleSelectSize('M')} >M</button>
                    <button data-testid='detailComponent-sizeBtn' className={`py-2 px-7 mr-3 bg-slate-200 border ${selectedSize === 'L' ? 'border-black' : 'border-white'}`} onClick={() => handleSelectSize('L')} >L</button>
                </div>
            </div>
        </div>
    )
}