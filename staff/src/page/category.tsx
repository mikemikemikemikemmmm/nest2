import { useEffect, useLayoutEffect, useState } from 'react'
import { getAllNavDataForCategoryPageApi, getProductCardDataBySeriesIdApi, ResAllCategoryType, ResCategory, ResNav, ResProductCard, ResSeries, ResSubcategory } from '../api/get'
import { dispatchError } from '../utils/errorHandler'
import { Card, List, ListItem, ListItemButton, ListItemText, Box, IconButton, CardContent, Stack, Grid, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from '@mui/system'
import { ModalContainer } from '../component/ModalContainer';
import { deleteCategoryApi, deleteNavApi, deleteSeriesApi, deleteSubCategoryApi } from '../api/delete';
import { CategoryPageModal } from '../component/categoryPageModal';
import { ProductCard } from '../component/productCard';
export type NavType = 'nav' | 'category' | 'subCategory' | 'series'
const mapTypeName = {
    'nav': "導覽行",
    'category': '大分類',
    'subCategory': '小分類',
    'series': "全系列"
} as Record<NavType, string>
export type ModalData = {
    id: number,
    name: string,
    sort: number,
    route?: string
}
function Ul(props: {
    data: ResAllCategoryType[] | undefined,
    type: NavType,
    nowSelectedItem: { id: number } | undefined,
    parentId: number,
    selectFn: (id: number, type: NavType) => void,
    toggleToRenderFn: () => void,
}) {
    const { data, type, nowSelectedItem, selectFn, parentId = -1, toggleToRenderFn } = props
    const [isShowModal, setIsShowModal] = useState(false)
    const [modalData, setModalData] = useState<ModalData | undefined>(undefined)
    const closeModal = () => {
        setModalData(undefined)
        setIsShowModal(false)
    }
    const handleEdit = (modalData: ModalData) => {
        setModalData(modalData)
        setIsShowModal(true)
    }
    const handleCreate = () => {
        setModalData(undefined)
        setIsShowModal(true)
    }
    const handleDelete = async (id: number) => {
        if (!confirm('確定要刪除嗎')) {
            return
        }
        if (!data) {
            dispatchError('刪除發生錯誤')
            return
        }
        const target = data.find(item => item.id === id)
        if (!target) {
            dispatchError('刪除發生錯誤')
            return
        }
        if (target.children && target.children.length > 0) {
            dispatchError('不可刪除還有子元素的分類')
            return
        }
        const targetApi = (() => {
            switch (type) {
                case 'nav':
                    return deleteNavApi
                case 'category':
                    return deleteCategoryApi
                case 'subCategory':
                    return deleteSubCategoryApi
                case 'series':
                    return deleteSeriesApi
            }
        })()
        const executeDelete = await targetApi(id)
        if (executeDelete.error) {
            return
        }
        toggleToRenderFn()
    }
    const renderModal = () => {
        return (
            <ModalContainer closeFn={closeModal} isOpen={isShowModal}>
                <Stack spacing={2}>
                    <CategoryPageModal
                        type={type}
                        parentId={parentId}
                        modalData={modalData}
                        closeModalFn={closeModal}
                        toggleToRenderFn={toggleToRenderFn}
                    />
                </Stack>
            </ModalContainer>)
    }
    const hasParent = (listData: typeof data) => {
        return Array.isArray(listData)
    }
    const hasData = (listData: typeof data) => {
        return Array.isArray(listData) && listData.length > 0
    }
    return (
        <>
            {
                isShowModal && renderModal()
            }
            <Card>
                <CardContent>
                    <List>
                        <ListItem dense={true} disablePadding>
                            <ListItemText sx={{ textAlign: 'center' }} primary={mapTypeName[type]} />
                        </ListItem>
                        {
                            hasParent(data) ?
                                <ListItem dense={true} disablePadding >
                                    <ListItemButton onClick={() => handleCreate()}>
                                        <ListItemText primary='新增' />
                                    </ListItemButton>
                                </ListItem> : null
                        }
                        {
                            hasData(data) ? (data as ResAllCategoryType[]).map(item => (
                                <ListItem dense={true} disablePadding key={item.id}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemButton
                                        onClick={() => selectFn(item.id, type)}
                                        onDoubleClick={() => handleEdit(item)}
                                        selected={nowSelectedItem?.id === item.id}

                                    >
                                        <ListItemText primary={item.name} />
                                    </ListItemButton>
                                </ListItem>))
                                :
                                <ListItem dense={true} disablePadding >
                                    <ListItemText sx={{ textAlign: 'center' }} primary={'無資料'} />
                                </ListItem>
                        }
                    </List>
                </CardContent>
            </Card >
        </>
    );
}

export const Category = () => {
    const [data, setData] = useState<ResNav[] | []>([])
    const [productCardData, setProductCardData] = useState<ResProductCard[]>([])
    const [selectedNav, setSelectedNav] = useState<ResNav | undefined>(undefined)
    const [selectedCategory, setSelectedCategory] = useState<ResCategory | undefined>(undefined)
    const [selectedSubCategory, setSelectedSubCategory] = useState<ResSubcategory | undefined>(undefined)
    const [selectedSeries, setSelectedSeries] = useState<ResSeries | undefined>(undefined)
    const [toggleToRender, setToggleToRender] = useState<boolean>(false)
    const toggleToRenderFn = () => {
        setToggleToRender(!toggleToRender)
    }
    const getAllData = async () => {
        const { result, error } = await getAllNavDataForCategoryPageApi()
        if (error || !result) {
            return
        }
        setData(result)
    }
    useEffect(() => {
        getAllData()
    }, [toggleToRender])
    useEffect(() => {
        const nowSelectedIdStatus = {
            nav: selectedNav?.id,
            category: selectedCategory?.id,
            subCategory: selectedSubCategory?.id,
            series: selectedSeries?.id,
        }
        const { nav, category, subCategory, series } = nowSelectedIdStatus
        const targetNav = data.find(n => n.id === nav)
        setSelectedNav(targetNav)
        const targetCategory = targetNav?.children?.find(c => c.id === category)
        setSelectedCategory(targetCategory)
        const targetSubCategory = targetCategory?.children?.find(sc => sc.id === subCategory)
        setSelectedSubCategory(targetSubCategory)
        const targetSeries = targetSubCategory?.children?.find(s => s.id === series)
        setSelectedSeries(targetSeries)
    }, [data])
    const handleSelectLiItem = async (id: number, type: NavType) => {
        let target: ResAllCategoryType | undefined = undefined
        switch (type) {
            case 'nav':
                target = data.find(nav => nav.id === id)
                setSelectedNav(target)
                setSelectedCategory(undefined)
                setSelectedSubCategory(undefined)
                setSelectedSeries(undefined)
                break;
            case 'category':
                target = selectedNav?.children.find(category => category.id === id)
                setSelectedCategory(target)
                setSelectedSubCategory(undefined)
                setSelectedSeries(undefined)
                break;
            case 'subCategory':
                target = selectedCategory?.children.find(subcategory => subcategory.id === id)
                setSelectedSubCategory(target)
                setSelectedSeries(undefined)
                break;
            case 'series':
                target = selectedSubCategory?.children.find(series => series.id === id)
                setSelectedSeries(target)
                break;
        }
        if (type === 'series') {
            const { error, result } = await getProductCardDataBySeriesIdApi(id)
            if (error || !result) {
                dispatchError('抓取產品資料時發生錯誤')
            } else {
                setProductCardData(result)
            }
        } else {
            setProductCardData([])
        }
    }
    if (data.length === 0) {
        return <div className=""></div>
    }
    return (
        <Container>
            <Grid container columns={8} spacing={3}>
                <Grid item md={2} sm={4} xs={8} sx={{ height: '100%' }}>
                    <Ul
                        type='nav'
                        data={data}
                        nowSelectedItem={selectedNav}
                        selectFn={handleSelectLiItem}
                        parentId={-1}
                        toggleToRenderFn={toggleToRenderFn}
                    />
                </Grid>
                <Grid item md={2} sm={4} xs={8} sx={{ height: '100%' }}>
                    <Ul
                        type='category'
                        data={selectedNav?.children}
                        nowSelectedItem={selectedCategory}
                        selectFn={handleSelectLiItem}
                        parentId={selectedNav?.id || -1}
                        toggleToRenderFn={toggleToRenderFn}
                    />
                </Grid>
                <Grid item md={2} sm={4} xs={8} sx={{ height: '100%' }}>
                    <Ul
                        type='subCategory'
                        data={selectedCategory?.children}
                        nowSelectedItem={selectedSubCategory}
                        selectFn={handleSelectLiItem}
                        parentId={selectedCategory?.id || -1}
                        toggleToRenderFn={toggleToRenderFn}
                    />
                </Grid>
                <Grid item md={2} sm={4} xs={8} sx={{ height: '100%' }}>
                    <Ul
                        type='series'
                        data={selectedSubCategory?.children}
                        nowSelectedItem={selectedSeries}
                        selectFn={handleSelectLiItem}
                        parentId={selectedSubCategory?.id || -1}
                        toggleToRenderFn={toggleToRenderFn}
                    />
                </Grid>
                <Grid xs={8} item container columns={12} >
                    {productCardData.length === 0 ?
                        <Grid item xs={12} >無產品資料</Grid>
                        :
                        productCardData.map(pc => (
                            <Grid item xs={3} >
                                <ProductCard key={pc.id} id={pc.id} name={pc.name} first_subproduct_id={pc.first_subproduct_id} />
                            </Grid>)
                        )
                    }
                </Grid>
            </Grid>
        </Container >
    )
}