// src/App.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// --- IMPORT OUR NEW COMPONENTS ---
import { InvoiceTable } from "@/components/InvoiceTable"
import { ProductTable } from "@/components/ProductTable"
import { CustomerTable } from "@/components/CustomerTable"

function App() {
  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Swipe Invoice Extractor</h1>
        
        <div className="flex w-full max-w-sm items-center space-x-2 p-4 border rounded-lg">
          <Label htmlFor="invoice-file" className="font-semibold">
            Upload File
          </Label>
          <Input id="invoice-file" type="file" className="flex-grow" />
          <Button type="submit">Extract Data</Button>
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
          <InvoiceTable /> {/* <-- USE NEW COMPONENT */}
        </TabsContent>

        {/* --- Products Tab --- */}
        <TabsContent value="products">
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          <ProductTable /> {/* <-- USE NEW COMPONENT */}
        </TabsContent>

        {/* --- Customers Tab --- */}
        <TabsContent value="customers">
          <h2 className="text-2xl font-semibold mb-4">Customers</h2>
          <CustomerTable /> {/* <-- USE NEW COMPONENT */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App