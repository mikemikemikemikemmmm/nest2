import { Stack, TextField, Button, Grid, Card, Container, Box } from "@mui/material";
import React, { createRef, useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from "react-redux";
import { getAllColorsApi, getColorImageUrlApi, getProductBySearchNameApi, getProductCardDataByColorIdApi, ResColor, ResProductCard } from "../api/get";
import { ModalContainer } from "../component/ModalContainer";
import { dispatchError } from "../utils/errorHandler";
import { CreateColor, createColorAPi } from "../api/post";
import { setIsLoading } from "../store";
import { handleImgError } from "../utils/imgError";
import { formdataKeyForData, formdataKeyForFile, newIdStart } from "../config";
import { PutColor, putColorApi } from "../api/put";
import { deleteColorApi } from "../api/delete";
import { ProductCard } from "../component/productCard";
interface IModalData {
    id: number
    name: string
    file?: File
}
const ColorModal = (props: { modalData: IModalData, imgUrlProp?: string, closeModal: () => void, toggleToRender: () => void, setTimestamp?: (timeStamp: number) => void }) => {
    const dispatch = useDispatch()
    const { modalData, toggleToRender, closeModal, setTimestamp, imgUrlProp } = props
    const [data, setData] = useState<IModalData>(modalData)
    const isCreate = data.id < 0
    const imgElId = "imgElForColorModalId"
    const [nameHasFocused, setNameHasFocused] = useState(false)
    const [imageUrl, setImageUrl] = useState(() => isCreate ? undefined : imgUrlProp)
    const handleSubmit = async () => { //TODO
        setNameHasFocused(true)
        if (data.name === '') {
            dispatchError('名稱為必須')
            return
        }
        if (!isCreate) {
            const put = await putColorApi(data as PutColor)
            if (!put?.error) {
                if (data.file && setTimestamp) {
                    setTimestamp(new Date().getTime())
                }
                closeModal()
                toggleToRender()
            }
        } else {
            if (!data.file) {
                dispatchError('圖片為必須')
                return
            }
            const _data = { ...data } as CreateColor
            const create = await createColorAPi(_data)
            if (!create?.error) {
                closeModal()
                toggleToRender()
            }
        }
    }
    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({ ...data, name: e.target.value })
    }
    const handleUploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            dispatchError('上傳圖片失敗')
            return
        }
        dispatch(setIsLoading(true))
        const reader = new FileReader()
        reader.onload = (e) => {
            const el = document.getElementById(imgElId)
            if (!el || !e.target?.result) {
                dispatch(setIsLoading(false))
                dispatchError('上傳圖片失敗')
                return
            }
            const dataUrl = e.target.result as string
            const img = new Image()
            img.onload = () => {
                const { width } = img
                const { height } = img
                if (width !== 48 || height !== 48) {
                    dispatch(setIsLoading(false))
                    dispatchError('長寬有一不為48px')
                    return
                }
                setData({ ...data, file })
                setImageUrl((e.target as FileReader).result as string)
                dispatch(setIsLoading(false))
            }
            img.src = dataUrl
        };
        reader.readAsDataURL(file);
    }
    return (
        <>
            <TextField
                sx={{ color: 'black' }}
                label="名稱"
                onBlur={() => setNameHasFocused(true)}
                error={data.name === '' && nameHasFocused} variant="outlined" defaultValue={data.name} onChange={(e) => handleChangeName(e)} />
            <Box sx={{ margin: 1, padding: 1, display: 'flex', justifyContent: 'center' }}>
                <img
                    id={imgElId}
                    style={{ width: imageUrl ? 48 : 0, height: imageUrl ? 48 : 0 }}
                    src={imageUrl}
                    onError={(e) => handleImgError(e)} />
                <IconButton color="primary" component="label">
                    <AddPhotoAlternateIcon />
                    <input hidden accept=".jpg" type="file" onChange={e => handleUploadImg(e)} />
                </IconButton>
            </Box>
            <div>上傳圖片 僅限 48px x 48px jpg檔案</div>
            <Button variant="contained" onClick={() => handleSubmit()}>送出</Button>
        </>
    )
}
const ColorCard = (props: { id: number, name: string, toggleFn: () => void, selectColor: (colorId: number) => void }) => {
    const { id, name, toggleFn, selectColor } = props
    const [timestamp, setTimestamp] = useState(() => new Date().getTime())
    const [modalData, setModalData] = useState<{ id: number, name: string } | undefined>(undefined)
    const imgUrl = getColorImageUrlApi(id, timestamp)
    const handleEdit = (id: number, name: string) => {
        setModalData({ id, name })
    }
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        e.stopPropagation()
        if (confirm('確定刪除嗎')) {
            const executeDelete = await deleteColorApi(id)
            if (!executeDelete?.error) {
                toggleFn()
            }
        }
    }
    const closeModal = () => {
        setModalData(undefined)
    }
    const renderModal = () => {
        if (modalData === undefined) {
            return null
        }
        return <ModalContainer closeFn={closeModal} isOpen={true}>
            <Stack spacing={2}>
                <ColorModal
                    imgUrlProp={imgUrl}
                    setTimestamp={setTimestamp}
                    modalData={modalData}
                    toggleToRender={toggleFn}
                    closeModal={closeModal}
                />
            </Stack>
        </ModalContainer>
    }
    return (
        <>
            {
                renderModal()
            }
            <Grid item md={2} sm={3} xs={6}>
                <Card sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => selectColor(id)}>
                        <Box sx={{ textAlign: 'center', Color: 'black' }}>
                            <div>{name}</div>
                            <div >
                                <img src={imgUrl} onError={e => handleImgError(e)} alt={name} width={48} height={48} />
                            </div>
                        </Box>
                    </Button>
                    <span>
                        <IconButton sx={{ display: 'flex' }} aria-label="delete" onClick={(e) => handleDelete(e, id)}>
                            <HighlightOffIcon sx={{ color: 'red' }} />
                        </IconButton>
                        <IconButton sx={{ display: 'flex' }} aria-label="edit" onClick={() => handleEdit(id, name)}>
                            <EditIcon sx={{ color: 'black' }} />
                        </IconButton>
                    </span>
                </Card>
            </Grid>
        </>
    )
}
export const Color = () => {
    const [colors, setColors] = useState<ResColor[]>([])
    const [toggleToRender, setToggleToRender] = useState(false)
    const [productCard, setProductCard] = useState<ResProductCard[]>([])
    const [modalData, setModalData] = useState<IModalData | undefined>(undefined)
    const closeModal = () => {
        setModalData(undefined)
    }
    const handleCreate = () => {
        setModalData({ id: newIdStart, name: '' })
    }
    const getColors = async (name?: string) => {
        if (name === undefined) {
            const { result, error } = await getAllColorsApi()
            if (error || !result) {
                return
            }
            setColors(result)
            return
        } else {
            const { result, error } = await getProductBySearchNameApi(name)
            if (error || !result) {
                return
            }
            setColors(result)
        }
    }
    const renderModal = () => {
        if (modalData === undefined) {
            return null
        }
        return <ModalContainer closeFn={closeModal} isOpen={true}>
            <Stack spacing={2}>
                <ColorModal
                    modalData={modalData}
                    toggleToRender={() => setToggleToRender(!toggleToRender)}
                    closeModal={closeModal}
                />
            </Stack>
        </ModalContainer>
    }
    const handleSelectColor = async (colorId: number) => {
        const { result, error } = await getProductCardDataByColorIdApi(colorId)
        if (error || !result) {
            dispatchError('產生錯誤')
            return
        }
        setProductCard(result)
    }
    useEffect(() => {
        getColors()
    }, [toggleToRender])
    return (
        <>
            {
                renderModal()
            }
            <Container>
                <Grid container sx={{ margin: 1 }} spacing={2}>
                    <Grid item md={2} sm={4} xs={6}>
                        <Button sx={{ height: '100%' }} variant="contained" fullWidth onClick={() => handleCreate()}>新增顏色</Button>
                    </Grid>
                    {/* <Grid item md={2} sm={4} xs={6}>
                        <TextField sx={{ height: '100%' }} fullWidth size="small" label="搜尋" type="search" onChange={(e) => handleSearch(e)} />
                    </Grid> */}
                    <Grid item md={10} sm={8} xs={6}>
                    </Grid>
                    {
                        colors.map(c => <ColorCard
                            selectColor={handleSelectColor}
                            key={c.id}
                            id={c.id}
                            name={c.name}
                            toggleFn={() => setToggleToRender(!toggleToRender)} />)
                    }
                </Grid>
                <Grid container sx={{ margin: 1 }} spacing={2}>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={() => setProductCard([])}>
                            清空產品資料
                        </Button>
                    </Grid>
                    {productCard.length === 0 ?
                        <Grid item xs={12} >無產品資料</Grid>
                        :
                        productCard.map(pc => (
                            <Grid item xs={2} key={pc.id} >
                                <ProductCard id={pc.id} name={pc.name} first_subproduct_id={pc.first_subproduct_id} />
                            </Grid>)
                        )
                    }
                </Grid>
            </Container>
        </>
    )
}