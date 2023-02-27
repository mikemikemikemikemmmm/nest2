import { Card, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Button, TextField, Box } from "@mui/material";
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getProductDetailDataByProductIdApi, ResProductDataForDetailPage, getProductIdBySeriesIdAndNameApi, ResColor, ResSubProduct, ResSeriesForDetailPage } from "../api/get"
import { newIdStart } from "../config"
import { dispatchError, isNewSubproduct, ValidData } from "../utils/errorHandler"
import { useDispatch } from "react-redux";
import { deleteProductApi, deleteSubProductApi } from "../api/delete";
import { SubProductCard } from "../component/subProductCard";
import { isNumInt } from "../utils/isPostiveInt";
import { PutProduct, putProductApi, PutSubproduct } from "../api/put";
const validData: ValidData<ResProductDataForDetailPage> = {
    name: {
        errorMessenge: '名稱為必須',
        validFn: (val) => val !== ''
    },
    series_id: {
        errorMessenge: '系列需為整數',
        validFn: (val) => isNumInt(val)
    },
    sort: {
        errorMessenge: '系列需為整數',
        validFn: (val) => isNumInt(val)
    },
    id: {
        validFn: () => true,
        errorMessenge: ""
    },
    series_name: {
        validFn: () => true,
        errorMessenge: ""
    },
    sub_products: {
        validFn: () => true,
        errorMessenge: ""
    }
}
export const DetailPage = () => {
    const { productId } = useParams()
    const dispatch = useDispatch()
    const navigator = useNavigate()
    const counterRef = useRef(newIdStart)
    const createIdForNew = () => {
        counterRef.current -= 1
        return counterRef.current
    }
    const [data, setData] = useState<ResProductDataForDetailPage>({
        id: Number(productId),
        name: '',
        series_id: '',
        sort: 0,
        series_name: '',
        sub_products: []
    })
    const originData = useRef<ResProductDataForDetailPage | null>({ ...data, sub_products: [] })
    const [colors, setColors] = useState<ResColor[]>([])
    const [series, setSeries] = useState<ResSeriesForDetailPage[]>([])
    const [toggleToRender, setToggleToRender] = useState(false)
    const createEmptySubProductData = (): ResSubProduct => {
        return {
            product_id: Number(productId) as number,
            id: createIdForNew(),
            sort: 0,
            price: 0,
            color_id: colors[0].id,
            size_s: 0,
            size_m: 0,
            size_l: 0
        }
    }
    const getProductDetailData = async () => {
        const numId = Number(productId)
        const { result, error } = await getProductDetailDataByProductIdApi(numId)
        if (error || !result || Array.isArray(result) || isNaN(numId)) {
            dispatchError(error)
            return
        }
        const { colors, series, product } = result
        const targetProcutData = product[0]
        setData(targetProcutData)
        setColors(colors)
        setSeries(series)
        originData.current = { ...targetProcutData, sub_products: targetProcutData.sub_products.map(sp => { return { ...sp } }) }
    }
    useEffect(() => {
        getProductDetailData()
    }, [toggleToRender])
    const handleEditProduct = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof typeof data) => {
        const propType = typeof data[key] as 'string' | 'number'
        const { value } = e.target
        let _value: number | string = value
        if (propType === 'number') {
            _value = Number(value)
        }
        setData({ ...data, [key]: _value })
    }
    const handleCreateSubProduct = () => {
        const newSubProduct = createEmptySubProductData()
        originData.current?.sub_products.push({ ...newSubProduct })
        setData({ ...data, sub_products: [...data.sub_products, { ...newSubProduct }] })
    }
    const handleDeleteProduct = async () => {
        if (data.sub_products.length > 0) {
            dispatchError('請刪除所有副產品再刪除')
            return
        }
        const executeDelete = await deleteProductApi(data.id)
        if (executeDelete.error) {
            return dispatchError(executeDelete.error)
        }
        navigator('/product')
        //TODO
    }
    const handleDeleteSubproduct = async (subproductIndex: number) => {
        if (!confirm('確認刪除嗎')) {
            return
        }
        const targetSubproduct = data.sub_products[subproductIndex]
        if (!isNewSubproduct(targetSubproduct)) {
            const executeDelete = await deleteSubProductApi(targetSubproduct.id)
            if (executeDelete.error) {
                dispatchError(executeDelete.error)
                return
            }
        }
        const copySubproductList = [...data.sub_products]
        copySubproductList.splice(subproductIndex, 1)
        setData({ ...data, sub_products: copySubproductList })
    }
    const handleSetSubproductDataByIndex = (index: number, inputData: ResSubProduct) => {
        const copy = [...data.sub_products]
        copy[index] = inputData
        setData({ ...data, sub_products: copy })
    }
    const handleSelectSeries = (e: SelectChangeEvent<number>) => {
        const { value } = e.target
        const _value = Number(value)
        if (isNaN(_value) || !Number.isInteger(_value)) {
            dispatchError('請選擇整數字')
            return
        }
        setData({ ...data, series_id: _value })
    }
    const isVaildAllInput = () => {
        return data.name !== '' &&
            data.series_id !== '' &&
            isNumInt(data.series_id, data.sort) &&
            data.sub_products.every(sp => {
                return isNumInt(sp.color_id, sp.price, sp.product_id, sp.size_l, sp.size_m, sp.size_s, sp.sort)
            })
    }
    const isAllColorIdDiff = () => {
        const map = {} as { [key: number]: boolean }
        return data.sub_products.every(sp => {
            if (!map[sp.color_id]) {
                map[sp.color_id] = true
                return true
            }
            return false
        })
    }
    const isAllHasFile = () => {
        return data.sub_products.every(sp => {
            if (isNewSubproduct(sp)) {
                return !!sp.file
            }
            return true
        })
    }
    const handleSubmit = async () => { //TODO
        if (!isVaildAllInput()) {
            dispatchError('請確保無輸入錯誤')
            return
        }
        if (!isAllColorIdDiff()) {
            dispatchError('請確保所有顏色只有一個')
            return
        }
        if (!isAllHasFile()) {
            dispatchError('請確保所有副產品都有圖片')
            return
        }
        try {
            const dtoToPut = (() => {
                const origin = originData.current as ResProductDataForDetailPage
                const dto = { ...data, sub_products: [] } as PutProduct
                (Object.keys(data) as (keyof ResProductDataForDetailPage)[]).forEach(key => {
                    if (key === 'sub_products') {
                        const originSubprodctList = origin.sub_products
                        data.sub_products.forEach(sp => {
                            if (isNewSubproduct(sp)) {
                                dto.sub_products.push({ ...sp })
                                return
                            }
                            //put subproduct
                            const spDto = { ...sp } as PutSubproduct
                            const targetOriginSubporduct = originSubprodctList.find(originSp => originSp.id === sp.id)
                            if (!targetOriginSubporduct) {
                                dispatchError('error')
                                throw new Error("")
                            }
                            (Object.keys(sp) as (keyof PutSubproduct)[]).forEach((key: keyof PutSubproduct) => {
                                if (key === 'id') {
                                    return
                                }
                                if (spDto[key] === targetOriginSubporduct[key]) {
                                    delete spDto[key]
                                }
                            })
                            if (Object.keys(spDto).length <= 1) { //only id
                                return  //no need to put
                            }
                            dto.sub_products.push(spDto)
                        })
                    } else if (key === 'id') {
                        return
                    }
                    else if (dto[key] === origin[key] || key === 'series_name') {
                        delete dto[key]
                    }
                })
                return dto
            })()
            const executePut = await putProductApi(dtoToPut)
            if (executePut?.error) {
                dispatchError(executePut.error)
                return
            }
            setToggleToRender(!toggleToRender)
        } catch (error) {
            dispatchError(error)
        }
    }
    const handleRerender = () => {
        setToggleToRender(!toggleToRender)
    }
    return (
        <Container>
            <Card variant="outlined" sx={{ padding: 1, margin: 1 }}>
                <Box sx={{ textAlign: 'right' }}>
                    <Button sx={{ margin: 1 }} variant="contained" onClick={() => handleSubmit()}>
                        確認修改
                    </Button>
                    <Button sx={{ margin: 1 }} variant="contained" onClick={() => handleCreateSubProduct()}>
                        新增副產品
                    </Button>
                    <Button sx={{ margin: 1 }} variant="contained" onClick={() => handleDeleteProduct()}>
                        刪除該產品
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextField sx={{ margin: 1 }} size="small" margin="dense" label="名字" type={'text'} value={data.name} onChange={(e) => handleEditProduct(e, 'name')} />
                    <TextField sx={{ margin: 1 }} size="small" margin="dense" label="排序" type={'number'} value={data.sort} onChange={(e) => handleEditProduct(e, 'sort')} />
                    <FormControl sx={{ margin: 1 }} size="small" margin="dense">
                        <InputLabel id="productModalColorsSelect">系列</InputLabel>
                        <Select
                            labelId="productModalColorsSelect"
                            value={data.series_id}
                            label="系列"
                            onChange={e => handleSelectSeries(e)}
                        >
                            {
                                series.map(s => (
                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
            </Card>

            {
                data.sub_products.length === 0 ?
                    <Box sx={{ margin: 1, textAlign: 'center' }}>
                        沒有副產品
                    </Box>
                    :
                    data.sub_products.map((sp, i) => (
                        <SubProductCard
                            data={data.sub_products[i]}
                            handleSetSubproductDataByIndex={handleSetSubproductDataByIndex}
                            deleteSubproduct={handleDeleteSubproduct}
                            key={sp.id}
                            colorsData={colors}
                            subProductIndex={i} />
                    ))
            }
        </Container>
    )
}