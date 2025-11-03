import { configureStore } from "@reduxjs/toolkit"
import invoicesReducer from "@/features/invoicesSlice"
import customersReducer from "@/features/customersSlice"
import productsReducer from "@/features/productsSlice"

const store = configureStore({
    reducer: {
        invoices: invoicesReducer,
        products: productsReducer,
        customers: customersReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ReturnType<typeof store.dispatch>


