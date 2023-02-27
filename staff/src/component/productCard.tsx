import { Button, Card } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getImgUrlBySubProductIdApi } from "../api/get"
import { dispatchError } from "../utils/errorHandler"
import { handleImgError } from "../utils/imgError"
import errorImgUrl from '../assets/imgError.jpg'


export const ProductCard = (props: { id: number, name: string, first_subproduct_id: number | null }) => {
    const { id, name, first_subproduct_id } = props
    const [imgUrl, setImgUrl] = useState<'loading' | 'error' | string>('loading')
    const getProductImgUrl = () => {
        if (first_subproduct_id === null) {
            setImgUrl(errorImgUrl)
            return
        }
        const srcResult = getImgUrlBySubProductIdApi(first_subproduct_id)
        setImgUrl(srcResult)
    }
    useEffect(() => { getProductImgUrl() }, [])
    return <Card sx={{ padding: 1, textAlign: 'center' }}>
        <Link to={`/detail/${id}`}>
            {
                imgUrl === 'loading' ?
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="loading-ring"><div></div><div></div><div></div><div></div></div>
                    </div>
                    :
                    <img style={{ width: '100%' }} src={imgUrl} alt={name} onError={e => handleImgError(e)} />
            }
            <div>{name}</div>
        </Link>
    </Card>
}