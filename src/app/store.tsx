import { configureStore } from "@reduxjs/toolkit"
import invoicesReducer from "@/features/invoicesSlice"
import customersReducer from "@/features/customersSlice"
import productsReducer from "@/features/productsSlice"
import appReducer from "@/features/appSlice"

export const store = configureStore({
    reducer: {
        app: appReducer,
        invoices: invoicesReducer,
        products: productsReducer,
        customers: customersReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


