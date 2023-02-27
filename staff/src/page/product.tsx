import { Container, Grid, Button, TextField, Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import React, { useState, useEffect } from "react";
import { getProductsForProductPageApi, getSeriesDataForCreateProductApi, ResProductCard, ResSeriesForDetailPage } from "../api/get";
import { dispatchError, isValidInput, ValidData } from "../utils/errorHandler";
import { ProductCard } from "../component/productCard";
import { useNavigate } from "react-router-dom";
import { ModalContainer } from "../component/ModalContainer";
import { createProductApi } from "../api/post";
import { isNumInt } from "../utils/isPostiveInt";
interface ModalData { name: string, series_id: number, sort: number }
const validData: ValidData<ModalData> = {
    name: {
        errorMessenge: '名稱為必須',
        validFn: (val) => val !== ''
    },
    sort: {
        errorMessenge: '排序須為整數',
        validFn: (val) => isNumInt(val)
    },
    series_id: {
        errorMessenge: '系列須為整數',
        validFn: (val) => isNumInt(val)
    }
}
export const ProductModal = (props: { modalData: ModalData, toggle: () => void, closeModal: () => void, seriesData: ResSeriesForDetailPage[] }) => {
    const { modalData, seriesData, closeModal, toggle } = props
    const [data, setData] = useState<ModalData>(modalData)
    const [blured, setBlured] = useState({
        name: false
    })
    const handleSubmit = async () => {
        if (!isValidInput(modalData, validData)) {
            return
        }
        const execute = await createProductApi(data)
        if (!execute.error) {
            closeModal()
            toggle()
        }
    }
    return (
        <>
            <TextField
                label="名稱"
                onBlur={() => setBlured({ name: true })}
                error={data.name === '' && blured.name} variant="outlined" defaultValue={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
            <TextField
                type="number"
                label="排序"
                variant="outlined"
                defaultValue={data.sort}
                onChange={(e) => setData({ ...data, sort: Number(e.target.value) })} />
            <FormControl sx={{ margin: 1 }} size="small" margin="dense">
                <InputLabel id="seriesForProductModal">系列</InputLabel>
                <Select
                    labelId="seriesForProductModal"
                    value={data.series_id}
                    label="系列"
                    onChange={e => setData({ ...data, series_id: Number(e.target.value) })}
                >
                    {
                        seriesData.map(s => (
                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <Button onClick={() => handleSubmit()} fullWidth>
                新增
            </Button>
        </>
    )
}
export const ProductPage = () => {
    const [modalData, setModalData] = useState<ModalData | undefined>(undefined)
    const [productsData, setProductsData] = useState<ResProductCard[]>([])
    const [seriesData, setSeriesData] = useState<ResSeriesForDetailPage[]>([])
    const [toggleToRender, setToggleToRender] = useState(false)
    const closeModal = () => {
        setModalData(undefined)
    }
    const getProductsAndSeriesOnProductPage = async () => {
        const getSeries = await getSeriesDataForCreateProductApi()
        const getProducts = await getProductsForProductPageApi()
        if (getProducts.error || getSeries.error || !getProducts.result || !getSeries.result) {
            return
        }
        setProductsData(getProducts.result)
        setSeriesData(getSeries.result)
    }
    const handleCreate = () => {
        setModalData({ name: '', sort: 0, series_id: seriesData[0].id })
    }
    const handleToggle = () => {
        setToggleToRender(!toggleToRender)
    }
    const renderModal = () => {
        if (modalData === undefined) {
            return null
        }
        return <ModalContainer closeFn={closeModal} isOpen={true}>
            <Stack spacing={2}>
                <ProductModal
                    modalData={modalData}
                    seriesData={seriesData}
                    closeModal={closeModal}
                    toggle={handleToggle}
                />
            </Stack>
        </ModalContainer>
    }
    useEffect(() => {
        getProductsAndSeriesOnProductPage()
    }, [toggleToRender])
    return (
        <>
            {
                renderModal()
            }
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Button sx={{ height: '100%' }} variant="contained" fullWidth onClick={() => handleCreate()}>新增產品</Button>
                    </Grid>
                    <Grid item xs={10}  >
                    </Grid>
                    {productsData.map(p => (
                        <Grid key={p.id} item lg={2} md={3} sm={6} xs={12}>
                            <ProductCard key={p.id} id={p.id} name={p.name} first_subproduct_id={p.first_subproduct_id} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}