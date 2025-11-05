import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Product } from "@/types" 
import { useAppDispatch } from "@/app/hooks"
import { updateProduct } from "@/features/productsSlice"
import { toast } from "sonner"

interface EditProductDialogProps {
    product: Product
}

export const EditProductDialog = ({ product }: EditProductDialogProps) => {

    const dispatch = useAppDispatch()

    const [name, setName] = useState(product.name)
    const [quantity, setQuantity] = useState(product.quantity ?? 0)
    const [unitPrice, setUnitPrice] = useState(product.unitPrice ?? 0)
    const [tax, setTax] = useState(product.tax ?? 0)
    const [discount, setDiscount] = useState(product.discount ?? 0)
    const [category, setCategory] = useState(product.category ?? '')
    const [sku, setSku] = useState(product.sku ?? '')
    const [description, setDescription] = useState(product.description ?? '')

    const handleSaveChanges = () => {
        if(!name || unitPrice < 0){
            toast.error("Invalid input", {
                description: "Please check your product name and price.",
              })
            return
        }

        // Calculate priceWithTax
        const calculatedPriceWithTax = (unitPrice * quantity) + tax - discount

        dispatch(updateProduct({
            ...product, 
            name,
            quantity,
            unitPrice,
            tax,
            discount: discount || null,
            priceWithTax: calculatedPriceWithTax,
            category: category || null,
            sku: sku || null,
            description: description || null
        }))

        toast.success(`Product "${name}" updated successfully!`)
    }
  
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Edit</Button>
        </DialogTrigger>
        <DialogContent className="min-w-5xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitPrice" className="text-right">
                Unit Price
              </Label>
              <Input
                id="unitPrice"
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tax" className="text-right">
                Tax
              </Label>
              <Input
                id="tax"
                type="number"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discount" className="text-right">
                Discount
              </Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>

            <div className="col-span-4 border-t pt-2 mt-2">
              <p className="text-sm text-muted-foreground mb-2">Additional Details</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-6">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Electronics, Food"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU
              </Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="col-span-3"
                placeholder="Stock Keeping Unit"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-10">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Product description"
              />
            </div>
          </div>
  
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={handleSaveChanges}>
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }