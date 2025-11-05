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
  import { selectProcessedInvoices } from "@/features/invoicesSlice"
  
  const renderCell = (data: string | number | null | undefined) => {
    if (data === null || data === undefined) {
      return <span className="text-red-500 font-semibold">Missing</span>;
    }
    return data;
  };

  export const InvoiceTable = () => {
    // return fully processed data
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
                  {renderCell(invoice.serialNumber)}
                </TableCell>
                <TableCell>{renderCell(invoice.customerName)}</TableCell>
                <TableCell>{renderCell(invoice.productName)}</TableCell>
                <TableCell>{renderCell(invoice.qty)}</TableCell>
                <TableCell>{renderCell(invoice.tax)}</TableCell>
                <TableCell>{renderCell(invoice.date)}</TableCell>
                <TableCell className="text-right">
                  {renderCell(invoice.totalAmount)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )
  }