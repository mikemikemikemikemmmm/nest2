import React from 'react'
import ReactDOM from 'react-dom/client'
import Wrapper from './Wrapper'
import './style/index.css'
import { store } from './store'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Wrapper>
        <RouterProvider router={router} />
      </Wrapper>
    </Provider>
  </React.StrictMode>,
)
