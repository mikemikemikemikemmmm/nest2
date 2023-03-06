import {
    RouterProvider,
    createMemoryRouter,
} from "react-router-dom";
import * as React from "react";
import {
    render,
    waitFor,
    screen,
} from "@testing-library/react";
import { Provider } from "react-redux";
import Wrapper from "../../Wrapper";
import { NavState, store } from "../../store";
import { PageContainerWithNav } from "../../component/PageContainerWithNav";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavData } from "../../api/get";
import { fakeAllNavData } from "./fakeAllNavData";
export const createRouterContainer = (option: {
    el: JSX.Element,
    loaderData: object,
    startPath?: string,
}) => {
    const { el, loaderData, startPath = "/MEN" } = option
    const initialState = {
        allNavData: fakeAllNavData
    } as NavState
    const navSlice = createSlice({
        name: 'nav',
        initialState,
        reducers: {
            setAllNavData: (state, action: PayloadAction<NavData[]>) => {
                state.allNavData = action.payload
            },
        },
    })
    const store = configureStore({
        reducer: {
            navSlice: navSlice.reducer
        },
    })

    const routes = [
        {
            path: startPath,
            element: <PageContainerWithNav>{el}</PageContainerWithNav>,
            loader: () => {
                return { navRoute: "MEN", ...loaderData }
            },
        },
    ];

    const router = createMemoryRouter(routes, {
        initialEntries: ["/", startPath],
        initialIndex: 1,
    });
    return (
        <Provider store={store} >
            <Wrapper>
                <RouterProvider router={router} />
            </Wrapper>
        </Provider >
    )
}