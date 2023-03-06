import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllNavApi } from "../api/get"
import { APP_WIDTH } from "../style/const"
import { ErrorComponent } from "./errorComponent"
import { Nav } from "./Nav"
import { RootState, setAllNavData } from '../store'

export const PageContainerWithNav = (props: { children: JSX.Element }) => {
    return (
        <div className="App"
            style={{
                width: APP_WIDTH,
                fontSize: 12,
                color: '#706e6c',
                margin: '0 auto',
                padding: '0 40px'
            }}>
            <Nav />
            <div>{props.children}</div>

        </div>
    )
}