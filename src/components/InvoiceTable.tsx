// src/components/InvoiceTable.tsx
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { useAppSelector } from "@/app/hooks"
  // Import our new "smart" selector
  import { selectProcessedInvoices } from "@/features/invoicesSlice"
  
  export const InvoiceTable = () => {
    // This selector now returns the fully processed data!
    const invoices = useAppSelector(selectProcessedInvoices)
  
    return (
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
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No data extracted yet. Please upload a file.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice: any) => (
              <TableRow key={invoice.serialNumber}>
                <TableCell className="font-medium">
                  {invoice.serialNumber}
                </TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{invoice.productName}</TableCell>
                <TableCell>{invoice.qty ?? "N/A"}</TableCell>
                <TableCell>{invoice.tax ?? "N/A"}</TableCell>
                <TableCell>{invoice.date ?? "N/A"}</TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount ?? "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )
  }