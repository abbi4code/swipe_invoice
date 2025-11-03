import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

function App() {
  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Swipe Invoice Extractor</h1>
        
        {/* --- File Upload Section --- */}
        <div className="flex w-full max-w-sm items-center space-x-2 p-4 border rounded-lg">
          <Label htmlFor="invoice-file" className="font-semibold">
            Upload File
          </Label>
          <Input id="invoice-file" type="file" className="flex-grow" />
          <Button type="submit">Extract Data</Button>
        </div>
      </header>

      {/* --- Main Content Tabs --- */}
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
          {/* <ProductTable /> */}
          <p>Product table will go here.</p>
        </TabsContent>

        {/* --- Customers Tab --- */}
        <TabsContent value="customers">
          <h2 className="text-2xl font-semibold mb-4">Customers</h2>
          {/* We will create this component next */}
          {/* <CustomerTable /> */}
          <p>Customer table will go here.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// --- Placeholder Invoice Table Component ---
// We'll replace this with real data from Redux later
const InvoiceTable = () => (
  <Table>
    <TableCaption>A list of your extracted invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Serial No.</TableHead>
        <TableHead>Customer Name</TableHead>
        <TableHead>Product Name</TableHead>
        <TableHead>Qty</TableHead>
        <TableHead>Tax</TableHead>
        <TableHead>Date</TableHead>
        <TableHead className="text-right">Total Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell colSpan={7} className="text-center">
          No data extracted yet. Please upload a file.
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

export default App