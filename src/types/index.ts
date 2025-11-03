export interface Product {
    id: string, 
    name: string,
    quantity: number | null,
    unitPrice: number | null, 
    tax: number | null, 
    priceWithTax: number | null, 
    discount?: number | null 
}

export interface Customer {
    id: string;
    customerName: string;
    phoneNumber: string | null;
    totalPurchaseAmount: number | null;
  }
  
  export interface Invoice {
    serialNumber: string;
    customerId: string;
    productId: string;  
    qty: number | null;
    tax: number | null;
    totalAmount: number | null;
    date: string | null;
  }