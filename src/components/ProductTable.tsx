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
import { EditProductDialog } from "./EditProductDialog"

const renderCell = (data: string | number | null | undefined) => {
  if (data === null || data === undefined) {
    return <span className="text-red-500 font-semibold">Missing</span>;
  }
  return data;
};


export const ProductTable = () => {
    // read data directly from the redux store
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product: any) => (
              <TableRow key={product.id}>
                {/* <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.quantity ?? "N/A"}</TableCell>
                <TableCell>{product.unitPrice ?? "N/A"}</TableCell>
                <TableCell>{product.tax ?? "N/A"}</TableCell> */}
                <TableCell className="font-medium">{renderCell(product.name)}</TableCell>
                <TableCell>{renderCell(product.quantity)}</TableCell>
                <TableCell>{renderCell(product.unitPrice)}</TableCell>
                <TableCell>{renderCell(product.tax)}</TableCell>
                <TableCell className="text-right">
                {renderCell(product.priceWithTax)}
                </TableCell>
                <TableCell className="text-right">
                  <EditProductDialog product={product}/>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )
}