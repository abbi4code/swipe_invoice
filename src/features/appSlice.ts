import {createSlice} from "@reduxjs/toolkit"
import { extractDataFromFile } from "./extractionThunk"


type AppStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface AppState {
    status: AppStatus,
    error: string | null
}

const initialState: AppState = {
    status: 'idle',
    error: null
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {},
    //! will add extrareducers later
    extraReducers: (builder) => {
        builder.addCase(extractDataFromFile.pending, (state) => {
            state.status = 'loading';
            state.error = null
        })
        .addCase(extractDataFromFile.fulfilled, (state) => {
            state.status = 'succeeded';
            state.error = null
        })
        .addCase(extractDataFromFile.rejected, (state,action) => {
            state.status = 'failed';
            state.error = action.payload || 'Failed to extract data'
        })
    }
})

// selectors
export const selectAppStatus = (state: any) => state.app.status
export const selectAppError = (state: any) => state.app.error

export default appSlice.reducer;
