import { Card, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Button, TextField, Box } from "@mui/material";
import { useRef, useState } from "react"
import { getImgUrlBySubProductIdApi, ResColor, ResSubProduct } from "../api/get"
import { subProductImgHeight, subProductImgWidth } from "../config"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { dispatchError, isNewSubproduct } from "../utils/errorHandler"
import { handleImgError } from "../utils/imgError";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store";
export const SubProductCard = (props: {
    deleteSubproduct: (subproductIndex: number) => void
    data: ResSubProduct
    subProductIndex: number,
    handleSetSubproductDataByIndex: (index: number, data: ResSubProduct) => void,
    colorsData: ResColor[]
}) => {
    const { colorsData, data, handleSetSubproductDataByIndex, deleteSubproduct, subProductIndex } = props
    const dispatch = useDispatch()
    const isNew = isNewSubproduct(data)
    const imgEl = useRef<HTMLImageElement>(null)
    const [imgUrl, setImgUrl] = useState(() => {
        if (!isNew) {
            return getImgUrlBySubProductIdApi(data.id)
        }
        return ''
    })
    // const handleRecover = () => {
    //     setData({ ...originData })
    // }
    const handleEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>, key: keyof typeof data) => {
        const { value } = e.target
        let _value = Number(value)
        if (!Number.isInteger(_value) || _value < 0) {
            return
        }
        const _data = { ...data, [key]: Number(_value) }
        handleSetSubproductDataByIndex(subProductIndex, { ..._data })
    }
    const handleUploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            dispatchError('讀取圖片失敗')
            return
        }
        dispatch(setIsLoading(true))
        const reader = new FileReader()
        reader.onload = (e) => {
            const el = imgEl.current
            if (!el || !e.target || !e.target.result) {
                dispatchError('上傳圖片失敗')
                dispatch(setIsLoading(false))
                return
            }
            const dataUrl = e.target.result as string
            const img = new Image()
            img.onload = () => {
                const { width, height } = img
                if (width !== subProductImgWidth || height !== subProductImgHeight) {
                    dispatchError('長寬有一不為500px')
                    dispatch(setIsLoading(false))
                    return
                }
                handleSetSubproductDataByIndex(subProductIndex, { ...data, file: file })
                setImgUrl((e.target as FileReader).result as string)
                dispatch(setIsLoading(false))
            }
            img.src = dataUrl
        };
        reader.readAsDataURL(file);
    }
    const handleDelete = () => {
        deleteSubproduct(subProductIndex)
    }
    return (
        <>
            <Card variant="outlined" sx={{ padding: 1, margin: 1, position: 'relative' }}>
                <IconButton sx={{ position: 'absolute', top: 2, left: 2, zIndex: 100 }} aria-label="delete" onClick={() => handleDelete()}>
                    <HighlightOffIcon sx={{ color: 'red' }} />
                </IconButton>
                <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', width: 360, alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: imgUrl ? '100%' : 0 }} >
                            <Button component="label" sx={{ padding: imgUrl ? 1 : 0 }} disabled={!imgUrl}>
                                <img
                                    style={{ width: imgUrl ? '100%' : 0 }}
                                    ref={imgEl}
                                    src={imgUrl}
                                    onError={e => handleImgError(e)} />
                                <input hidden accept=".jpg" multiple type="file" onChange={e => handleUploadImg(e)} />
                            </Button>
                        </div>
                        <IconButton disabled={!!imgUrl} color="primary" component="label" >
                            <AddPhotoAlternateIcon fontSize="large" sx={{ width: imgUrl ? 0 : '100%' }} />
                            <input hidden accept=".jpg" type="file" onChange={e => handleUploadImg(e)} />
                        </IconButton>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {/* <Box sx={{ margin: 1, width: '100%', textAlign: 'right' }}>
                            <Button sx={{ margin: 1 }} variant="contained" onClick={() => { }}>
                                回復初值
                            </Button>
                        </Box> */}
                        <TextField sx={{ display: 'inline-block', margin: 1, width: '20%' }} label="價格" type={'number'} value={data.price} onChange={(e) => handleEdit(e, 'price')} />
                        <TextField sx={{ display: 'inline-block', margin: 1, width: '20%' }} label="排序" type={'number'} value={data.sort} onChange={(e) => handleEdit(e, 'sort')} />
                        <TextField sx={{ display: 'inline-block', margin: 1, width: '20%' }} label="S尺寸存量" type={'number'} value={data.size_s} onChange={(e) => handleEdit(e, "size_s")} />
                        <TextField sx={{ display: 'inline-block', margin: 1, width: '20%' }} label="M尺寸存量" type={'number'} value={data.size_m} onChange={(e) => handleEdit(e, 'size_m')} />
                        <TextField sx={{ display: 'inline-block', margin: 1, width: '20%' }} label="L尺寸存量" type={'number'} value={data.size_l} onChange={(e) => handleEdit(e, 'size_l')} />
                        <FormControl sx={{ display: 'inline-block', width: '50%', margin: 1 }}  >
                            <InputLabel id="productModalColorsSelect">顏色</InputLabel>
                            <Select
                                labelId="productModalColorsSelect"
                                value={data.color_id}
                                label="顏色"
                                onChange={e => handleEdit(e, 'color_id')}
                            >
                                {
                                    colorsData.map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </Card >
        </>
    )
}