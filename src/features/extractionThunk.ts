import { createAsyncThunk } from "@reduxjs/toolkit";
import { readFileAsBase64, readExcelFileAsJson } from "@/lib/fileReader";
import { callModalApi, type ExtractionResponse } from "@/api/aiModelApi";
// import { setInvoices } from "./invoicesSlice";
// import { setCustomers } from "./customersSlice";
// import { setProducts } from "./productsSlice";
import type { AppDispatch } from "@/app/store";

interface ExtractDataArgs {
    file: File;
}

export const extractDataFromFile = createAsyncThunk<ExtractionResponse, ExtractDataArgs, {dispatch: AppDispatch; rejectValue: string}> (
    'app/extractData',
    async ({file}, {rejectWithValue}) => {
        try {
            let fileData: string;
            let mimeType: string;

            // process file based on its type
            const fileType = file.type;

            if(fileType.includes('pdf') || fileType.includes('image')){
                fileData = await readFileAsBase64(file);
                mimeType = file.type
            }else if (
                fileType.includes('spreadsheetml') ||
                fileType.includes('excel')
            ) {
                fileData = await readExcelFileAsJson(file);
                // We send Excel JSON as plain text
                mimeType = 'text/plain'; 
            } else {
                return rejectWithValue('Unsupported file format.');
            }

            // call ai API
            const response = await callModalApi(fileData, mimeType)

            if( !response.invoices || !response.products || !response.customers) {
                return rejectWithValue('Invalid data structure returned from AI.')
            }

            return response
        } catch (error) {
            if(error instanceof Error) {
                return rejectWithValue(error.message)
            }
            return rejectWithValue('An unknown error occurred during extraction.');
            
        }
    }
)