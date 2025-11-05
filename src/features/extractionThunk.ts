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
            let isExcel = false;

            // process file based on its type
            const fileType = file.type;

            if(fileType.includes('pdf') || fileType.includes('image')){
                fileData = await readFileAsBase64(file);
                mimeType = file.type
            }else if (
                fileType.includes('spreadsheetml') ||
                fileType.includes('excel') ||
                file.name.endsWith('.xlsx') ||
                file.name.endsWith('.xls')
            ) {
                // For Excel, convert to JSON text (Gemini doesn't support Excel as inlineData)
                fileData = await readExcelFileAsJson(file);
                mimeType = 'text/plain';
                isExcel = true;
            } else {
                return rejectWithValue('Unsupported file format.');
            }

            // call ai API
            const response = await callModalApi(fileData, mimeType, isExcel, fileType)
            console.log("response from AI after processed", response)

            // Check for valid response structure
            if( !response.invoices || !response.products || !response.customers) {
                return rejectWithValue('Invalid data structure returned from AI.')
            }
            // check if the AI returned all empty arrays (wrong file content)
            if (
                response.invoices.length === 0 &&
                response.products.length === 0 &&
                response.customers.length === 0
            ) {
                return rejectWithValue(
                    "No relevant data found. The file might not be an invoice, bill, or transaction sheet."
                );
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