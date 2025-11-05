import {createSlice, type PayloadAction, createSelector} from "@reduxjs/toolkit"
import type { Product } from "@/types"
import { extractDataFromFile } from "./extractionThunk"
import { clearAllData } from "./appSlice"
 

interface ProductState {
    products: Product[]
}

const initialState: ProductState = {
    products: []
}

const addOrUpdateProducts = (state: ProductState, newProducts: Product[]) => {
    newProducts.forEach((newProduct) => {
        const index = state.products.findIndex((p) => p.id === newProduct.id);
        if(index !== -1){
            state.products[index] = newProduct;
        } else {
            state.products.push(newProduct)
        }
    })
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
    },
    extraReducers: (builder) => {
        builder
      .addCase(extractDataFromFile.fulfilled, (state, action) => {
        addOrUpdateProducts(state, action.payload.products)
      })
      .addCase(clearAllData, (state) => {
        state.products = []
      })
    }
})

export const {setProducts,updateProduct} = productsSlice.actions

export const selectAllProducts = (state: any) => state.products.products

// recalculates product totals from invoices
export const selectProductsWithCalculatedTotals = createSelector(
    [selectAllProducts, (state: any) => state.invoices.invoices],
    (products, invoices) => {
        return products.map((product: Product) => {
            // find all invoices for this product
            const productInvoices = invoices.filter((inv: any) => inv.productId === product.id)
            const totalQuantity = productInvoices.reduce((sum: number, inv: any) => sum + (inv.qty || 0), 0)
            const totalTax = productInvoices.reduce((sum: number, inv: any) => sum + (inv.tax || 0), 0)
            const totalAmount = productInvoices.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0)
            
            return {
                ...product,
                quantity: totalQuantity || product.quantity,
                tax: totalTax || product.tax,
                priceWithTax: totalAmount || product.priceWithTax
            }
        })
    }
)

export default productsSlice.reducer