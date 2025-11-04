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
    const [price, setPrice] = useState(product.unitPrice ?? 0)
    //! will add more fields here as needed for eg. quantity,tx..

    const handleSaveChanges = () => {
        if(!name || price < 0){
            toast.error("Invalid input", {
                description: "Please check your product name and price.",
              })
            return
        }

        dispatch(updateProduct({...product, name: name, unitPrice: price
            // todo: also need recalculate priceWithTax here
        }))

        toast.success(`Product "${name}" updated successfully! `)
    }
  
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="price" className="text-right">
                Unit Price
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="col-span-3"
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