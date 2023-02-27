import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import { useLocation, useMatch, useNavigate, useParams } from "react-router-dom";

const routeData = [
    // {
    //     text: '首頁編輯',
    //     routeTo: '/'
    // },
    {
        text: '分類管理',
        routeTo: '/category',
    }, {
        text: '顏色管理',
        routeTo: '/color',
    }, {
        text: '產品列表',
        routeTo: '/product',
    }]
export default function DrawerNav() {
    const navigate = useNavigate()
    const [isShow, setIsShow] = useState(false);
    const toggleDrawer =
        (isShow: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setIsShow(isShow);
            };
    const handleClickRoute = (routedata: {
        text: string;
        routeTo: string;
    }) => {
        navigate(routedata.routeTo)
    }
    return (
        <div>
            <span>
                <React.Fragment key={'left'}>
                    <IconButton color="primary" onClick={toggleDrawer(true)} aria-label="add to shopping cart">
                        <MenuIcon />
                    </IconButton>
                    <Drawer
                        anchor={'left'}
                        open={isShow}
                        onClose={toggleDrawer(false)}
                    >
                        <Box
                            // sx={{ width: 200 }}
                            role="presentation"
                            onClick={toggleDrawer(false)}
                            onKeyDown={toggleDrawer(false)}
                        >
                            <List>
                                {routeData.map(route => (
                                    <ListItem key={route.text} disablePadding>
                                        <ListItemButton onClick={() => handleClickRoute(route)}>
                                            <ListItemText sx={{ textAlign: 'center' }} primary={route.text} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </React.Fragment>
            </span >
        </div>
    );
}