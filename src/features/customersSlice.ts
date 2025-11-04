import {createSlice, type PayloadAction} from "@reduxjs/toolkit"

import type {Customer} from "@/types"

interface CustomerState {
    customers: Customer[]
}

const initialState: CustomerState = {
    customers: []
}

const customersSlice = createSlice({
    name: "customers",
    initialState: initialState,
    reducers: {
        setCustomers: (state,action: PayloadAction<Customer[]>) =>{
            state.customers = action.payload
        }

    }
    
})

export const {setCustomers} = customersSlice.actions

export const selectAllCustomers = (state: any) => state.customers.customers

export default customersSlice.reducer
