import React from 'react'
import { StyledEngineProvider } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { store } from './store'
import { Provider } from 'react-redux'

import ReactDOM from 'react-dom/client'
import App from './App'
const mdTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 300,
      md: 600,
      lg: 900,
      xl: 1200,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={mdTheme}>
      <StyledEngineProvider injectFirst>
        <Provider store={store}>
          <App />
        </Provider>
      </StyledEngineProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
