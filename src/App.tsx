import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner" 
import React, { useState, useEffect } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { InvoiceTable } from "@/components/InvoiceTable"
import { ProductTable } from "@/components/ProductTable"
import { CustomerTable } from "@/components/CustomerTable"

import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { extractDataFromFile } from "./features/extractionThunk"
import { selectAppStatus, selectAppError } from "@/features/appSlice"


function App() {
  const dispatch = useAppDispatch()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const appStatus = useAppSelector(selectAppStatus)
  const appError = useAppSelector(selectAppError)
  const isLoading = appStatus === 'loading'

  useEffect(() => {
    if(appStatus === 'succeeded'){
      toast.success("Data extracted successfully")
    }
    if(appStatus === 'failed' && appError){
      console.log("error",appError)
      toast.error("Extraction Failed", {
        description: appError
      })
    }
  },[appStatus,appError])

  // handle for file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0){
      setSelectedFile(e.target.files[0])
    }else{
      setSelectedFile(null)
    }
  }

  const handleExtractData = () => {
    if(selectedFile) {
      dispatch(extractDataFromFile({file: selectedFile}))
    }else{
      toast.error("Please select a file first.")
    }
  }

  return (
    <div className="container flex flex-col w-full mx-auto p-8">
      <Toaster position="top-right" richColors/>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Swipe Invoice Extractor</h1>
        
        <div className="flex w-full items-center space-x-2 p-4 border rounded-lg">
          <Label htmlFor="invoice-file" className="font-semibold">
            Upload File
          </Label>
          <Input id="invoice-file" type="file" className="grow max-w-56 cursor-pointer" onChange={handleFileChange} accept=".xlsx, .pdf, .png, .jpeg, .jpg" disabled={isLoading}/>
          <Button type="submit" onClick={handleExtractData} disabled={isLoading}> {isLoading ? "Extracting..." : "Extract Data"}</Button>
        </div>
      </header>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* --- Invoices Tab --- */}
        <TabsContent value="invoices">
          <h2 className="text-2xl font-semibold mb-4">Invoices</h2>
          <InvoiceTable />
        </TabsContent>

        {/* --- Products Tab --- */}
        <TabsContent value="products">
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          <ProductTable />
        </TabsContent>

        {/* --- Customers Tab --- */}
        <TabsContent value="customers">
          <h2 className="text-2xl font-semibold mb-4">Customers</h2>
          <CustomerTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App