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
import { type Customer } from "@/types" 
import { useAppDispatch } from "@/app/hooks"
import { updateCustomer } from "@/features/customersSlice"
import { toast } from "sonner"

interface EditCustomerDialogProps {
    customer: Customer
}

export const EditCustomerDialog = ({ customer }: EditCustomerDialogProps) => {

    const dispatch = useAppDispatch()

    const [customerName, setCustomerName] = useState(customer.customerName)
    const [phoneNumber, setPhoneNumber] = useState(customer.phoneNumber ?? '')
    const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(customer.totalPurchaseAmount ?? 0)
    const [email, setEmail] = useState(customer.email ?? '')
    const [companyName, setCompanyName] = useState(customer.companyName ?? '')
    const [address, setAddress] = useState(customer.address ?? '')

    const handleSaveChanges = () => {
        if(!customerName){
            toast.error("Invalid input", {
                description: "Customer name is required.",
              })
            return
        }

        dispatch(updateCustomer({
            ...customer, 
            customerName,
            phoneNumber: phoneNumber || null,
            totalPurchaseAmount,
            email: email || null,
            companyName: companyName || null,
            address: address || null
        }))

        toast.success(`Customer "${customerName}" updated successfully!`)
    }
  
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Edit</Button>
        </DialogTrigger>
        <DialogContent className="min-w-5xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Make changes to customer information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Customer Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerName" className="text-right">
                Name
              </Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Phone Number */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>

            {/* Total Purchase Amount */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalPurchaseAmount" className="text-right">
                Total Purchase
              </Label>
              <Input
                id="totalPurchaseAmount"
                type="number"
                value={totalPurchaseAmount}
                onChange={(e) => setTotalPurchaseAmount(Number(e.target.value))}
                className="col-span-3"
              />
            </div>

            {/* 🌟 BONUS FIELDS */}
            <div className="col-span-4 border-t pt-2 mt-2">
              <p className="text-sm text-muted-foreground mb-2">Additional Details</p>
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                placeholder="customer@example.com"
              />
            </div>

            {/* Company Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyName" className="text-right">
                Company
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="col-span-3"
                placeholder="Company name"
              />
            </div>

            {/* Address */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="col-span-3"
                placeholder="Customer address"
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

