import {createSlice, type PayloadAction} from "@reduxjs/toolkit"
import { type RootState } from "@/app/store"

import type { Product } from "@/types"
 

interface ProductState {
    products: Product[]
}

const initialState: ProductState= {
    products: []
}

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        //! so, we will passsing a arr[], its not like we are taking a obj product and pusing it into products arr
        setProducts: (state,action: PayloadAction<Product[]>) => {
            state.products = action.payload
        },
        //! will help us when we need to edit a productt later
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.products.findIndex(p => p.id === action.payload.id)
            if(index !== -1){
                state.products[index] = action.payload
            }

        }
    }
})

export const {setProducts,updateProduct} = productsSlice.actions

export const selectAllProducts = (state: RootState) => state.products.products

export default productsSlice.reducer