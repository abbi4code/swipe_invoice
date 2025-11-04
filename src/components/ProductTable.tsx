// src/components/ProductTable.tsx
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
import { selectAllProducts } from "@/features/productsSlice"

export const ProductTable = () => {
    // Read data directly from the Redux store
    const products = useAppSelector(selectAllProducts)

    return (
      <Table>
        <TableCaption>A list of all extracted products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID (Product Name)</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead className="text-right">Price with Tax</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.quantity ?? "N/A"}</TableCell>
                <TableCell>{product.unitPrice ?? "N/A"}</TableCell>
                <TableCell>{product.tax ?? "N/A"}</TableCell>
                <TableCell className="text-right">
                  {product.priceWithTax ?? "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )
}