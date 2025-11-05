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
import { ModeToggle } from "@/components/mode-toggle"

import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { extractDataFromFile } from "./features/extractionThunk"
import { selectAppStatus, selectAppError, clearAllData } from "@/features/appSlice"
import { FileText, Upload } from "lucide-react"


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

  const handleClearData = () => {
    dispatch(clearAllData())
    toast.info("Data cleared", {
      description: "All tables have been reset.",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors/>
      
      {/* Modern Header with Gradient */}
      <header className="border-b bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Swipe Invoice Extractor
                </h1>
                <p className="text-sm text-muted-foreground">AI-powered data extraction from invoices</p>
              </div>
            </div>
            <ModeToggle />
          </div>
          
          {/* Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border rounded-xl bg-card shadow-sm">
            <div className="flex flex-1 items-center gap-3 w-full">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                {/* <Label htmlFor="invoice-file" className="text-sm font-medium cursor-pointer">
                  Choose File
                </Label> */}
                <Input 
                  id="invoice-file" 
                  type="file" 
                  className="mt-1 cursor-pointer" 
                  onChange={handleFileChange} 
                  accept=".xlsx, .pdf, .png, .jpeg, .jpg" 
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleExtractData} 
                disabled={isLoading || !selectedFile}
                className="min-w-[140px]"
              >
                {isLoading ? "Extracting..." : "Extract Data"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearData}
                disabled={isLoading}
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">

        <Tabs defaultValue="invoices" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="invoices" className="text-base">📋 Invoices</TabsTrigger>
            <TabsTrigger value="products" className="text-base">📦 Products</TabsTrigger>
            <TabsTrigger value="customers" className="text-base">👥 Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="mt-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">Invoices</h2>
              <p className="text-sm text-muted-foreground">All extracted invoice line items</p>
            </div>
            <InvoiceTable />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">Products</h2>
              <p className="text-sm text-muted-foreground">Product details with calculated totals</p>
            </div>
            <ProductTable />
          </TabsContent>

          <TabsContent value="customers" className="mt-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">Customers</h2>
              <p className="text-sm text-muted-foreground">Customer information with purchase totals</p>
            </div>
            <CustomerTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App