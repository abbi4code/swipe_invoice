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
  import { selectAllCustomers } from "@/features/customersSlice"
  
  export const CustomerTable = () => {
    // Read data directly from the Redux store
    const customers = useAppSelector(selectAllCustomers)
  
    return (
      <Table>
        <TableCaption>A list of all extracted customers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID (Customer Name)</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="text-right">Total Purchase Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No customers found.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer: any) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {customer.customerName}
                </TableCell>
                <TableCell>{customer.phoneNumber ?? "N/A"}</TableCell>
                <TableCell className="text-right">
                  {customer.totalPurchaseAmount ?? "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )
  }