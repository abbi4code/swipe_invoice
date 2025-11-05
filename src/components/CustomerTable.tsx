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
  import { selectCustomersWithCalculatedTotals } from "@/features/customersSlice"
  import { EditCustomerDialog } from "./EditCustomerDialog"
  
  const renderCell = (data: string | number | null | undefined) => {
    if (data === null || data === undefined) {
      return <span className="text-red-500 font-semibold">Missing</span>;
    }
    return data;
  };

  export const CustomerTable = () => {
    // dynamic selector to recalculates totals from invoices
    const customers = useAppSelector(selectCustomersWithCalculatedTotals)
  
    return (
      <Table>
        <TableCaption>A list of all extracted customers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID (Customer Name)</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="text-right">Total Purchase Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No customers found.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer: any) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {renderCell(customer.customerName)}
                </TableCell>
                <TableCell>{renderCell(customer.phoneNumber)}</TableCell>
                <TableCell className="text-right">
                  {renderCell(customer.totalPurchaseAmount)}
                </TableCell>
                <TableCell className="text-right">
                  <EditCustomerDialog customer={customer}/>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )
  }