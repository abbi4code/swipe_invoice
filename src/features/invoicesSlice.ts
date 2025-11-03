import {createSlice, type PayloadAction} from "@reduxjs/toolkit"
import { type RootState } from "@/app/store"

import type {Invoice} from "@/types"

interface InvoiceState {
    invoices: Invoice[]
}

const initialState: InvoiceState = {
    invoices: []
}

const invoicesSlice = createSlice({
    name: "invoices",
    initialState: initialState,
    reducers: {
        setInvoices: (state, action: PayloadAction<Invoice[]>) => {
            state.invoices = action.payload
        }

    }
})

export const {setInvoices} = invoicesSlice.actions

export const selectAllInvoices = (state: RootState) => state.invoices.invoices

export default invoicesSlice.reducer