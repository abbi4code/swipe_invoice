import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import {store} from "@/app/store.tsx"
import { ThemeProvider } from "@/components/theme-provider"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="swipe-ui-theme">
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
