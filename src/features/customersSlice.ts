import {createSlice, type PayloadAction, createSelector} from "@reduxjs/toolkit"

import type {Customer} from "@/types"
import { extractDataFromFile } from "./extractionThunk"
import { clearAllData } from "./appSlice"

interface CustomerState {
    customers: Customer[]
}

const initialState: CustomerState = {
    customers: []
}

const addOrUpdateCustomers = (state: CustomerState, newCustomers: Customer[]) => {
    newCustomers.forEach((newCustomer) => {
        const index = state.customers.findIndex((c) => c.id === newCustomer.id);
        if(index !== -1){
            state.customers[index] = newCustomer;
        }else{
            state.customers.push(newCustomer)
        }

    })
}

const customersSlice = createSlice({
    name: "customers",
    initialState: initialState,
    reducers: {
        setCustomers: (state,action: PayloadAction<Customer[]>) =>{
            state.customers = action.payload
        },
        updateCustomer: (state, action: PayloadAction<Customer>) => {
            const index = state.customers.findIndex(c => c.id === action.payload.id)
            if(index !== -1){
                state.customers[index] = action.payload
            }
        }

    },
    extraReducers: (builder) => {
        builder
          .addCase(extractDataFromFile.fulfilled, (state, action) => {
            addOrUpdateCustomers(state, action.payload.customers)
          })
          .addCase(clearAllData, (state) => {
            state.customers = []
          })
      },
    
})

export const {setCustomers, updateCustomer} = customersSlice.actions

export const selectAllCustomers = (state: any) => state.customers.customers

// recalculates customer totals from invoices
export const selectCustomersWithCalculatedTotals = createSelector(
    [selectAllCustomers, (state: any) => state.invoices.invoices],
    (customers, invoices) => {
        return customers.map((customer: Customer) => {
            // find all invoices for this customer
            const customerInvoices = invoices.filter((inv: any) => inv.customerId === customer.id)
            
            // calculate total purchase amount from invoices
            const totalPurchaseAmount = customerInvoices.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0)
            
            return {
                ...customer,
                totalPurchaseAmount: totalPurchaseAmount || customer.totalPurchaseAmount
            }
        })
    }
)

export default customersSlice.reducer
