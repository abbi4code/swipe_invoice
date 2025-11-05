export interface Product {
    id: string, 
    name: string,
    quantity: number | null,
    unitPrice: number | null, 
    tax: number | null, 
    priceWithTax: number | null, 
    discount?: number | null,
    category?: string | null,
    sku?: string | null,
    description?: string | null
}

export interface Customer {
    id: string;
    customerName: string;
    phoneNumber: string | null;
    totalPurchaseAmount: number | null;
    email?: string | null;
    companyName?: string | null;
    address?: string | null;
  }
  
  export interface Invoice {
    id: string,
    serialNumber: string;
    customerId: string;
    productId: string;  
    qty: number | null;
    tax: number | null;
    totalAmount: number | null;
    date: string | null;
  }