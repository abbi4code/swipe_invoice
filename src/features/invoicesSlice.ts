import {createSlice, type PayloadAction} from "@reduxjs/toolkit"

import type {Invoice} from "@/types"

import { createSelector } from "@reduxjs/toolkit"
import { selectAllCustomers } from "./customersSlice"
import { selectAllProducts } from "./productsSlice"
import { extractDataFromFile } from "./extractionThunk"

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
    },
    extraReducers: (builder) => {
        builder.addCase(extractDataFromFile.fulfilled, (state,action) => {
            state.invoices = action.payload.invoices
        })
    }
})

export const selectAllInvoices = (state: any) => state.invoices.invoices

// memoized selector
export const selectProcessedInvoices = createSelector(
    [selectAllInvoices,selectAllProducts,selectAllCustomers], (invoices,products,customers) => {
        //look up maps to get in constant time
        const productMap = new Map(products.map((p: any) => [p.id,p.name]))
        const customerMap = new Map(customers.map((c: any) => [c.id,c.customerName]))

        return invoices.map((invoice: any) => ({
            ...invoice,
            productName: productMap.get(invoice.productId) || "Unknown Product",
            customerName: customerMap.get(invoice.customerId) || "Unknown Customer"
        }))
    }
)
export const {setInvoices} = invoicesSlice.actions
export default invoicesSlice.reducer
