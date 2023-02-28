
import React, { useEffect, useState } from "react";
import { createBrowserRouter, createHashRouter, Route, RouterProvider, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import '../src/style/index.css'
import { Category } from "./page/category";
import { Color } from "./page/color";
import { ProductPage } from "./page/product";
import { DetailPage } from "./page/detail";
import { LoginPage } from "./page/login";
import { PageContainer } from "./component/pageContainer";
export const router = createHashRouter([
  {
    path: "/",
    element: <PageContainer hasNav={false}><LoginPage /></PageContainer>,
  },
  {
    path: "/category",
    element: <PageContainer><Category /></PageContainer>,
  },
  {
    path: "/color",
    element: <PageContainer><Color /></PageContainer>,
  },
  {
    path: "/product",
    element: <PageContainer><ProductPage /></PageContainer>,
  },
  {
    path: "/detail/:productId",
    element: <PageContainer><DetailPage /></PageContainer>,
  },
]);
export default function App() {
  console.log('app render')
  return (
    <RouterProvider router={router} />
  );
}
