# Swipe Invoice Extractor
**An intelligent, AI-powered invoice data extraction application that processes multiple file formats (PDFs, Images, Excel) and automatically extracts structured invoice, product, and customer information using Google's Gemini AI.**



https://github.com/user-attachments/assets/10665148-4195-407f-82a4-dd03508c0129

- **Xlsx file**

 <img width="1368" height="739" alt="Screenshot 2025-11-05 at 11 16 38 PM" src="https://github.com/user-attachments/assets/fa0d5f3a-2205-4505-b05d-9a0553de8a53" />
<img width="1352" height="746" alt="Screenshot 2025-11-05 at 11 23 40 PM" src="https://github.com/user-attachments/assets/dfe5db37-5e5f-48a3-a99b-b31c042b1b26" />

- **Valid Format with irrelevant data** (Handled several other test case discuss below)

<img width="990" height="605" alt="Screenshot 2025-11-05 at 11 18 42 PM" src="https://github.com/user-attachments/assets/ef6596c6-764e-40bb-8c9c-b1433ea5b806" />

<img width="1404" height="559" alt="Screenshot 2025-11-05 at 11 19 04 PM" src="https://github.com/user-attachments/assets/2b76c860-ded0-414d-9cc4-262cc01a0a61" />




## Features

### Core Functionality
- **Multi-Format File Support**: Process invoices from PDFs, images (PNG, JPG, JPEG), and Excel spreadsheets (.xlsx, .xls)
- **AI-Powered Extraction**: Leverages Google Gemini 2.5 Flash for intelligent data extraction
- **Real-Time Synchronization**: Changes in one tab automatically reflect across all related tabs
- **Data Merging**: Upload multiple files with option to merge or replace existing data
- **Dark Mode**: Complete dark mode support with system theme detection

### Advanced Features
- **Dynamic Calculations**: Product quantities and customer totals auto-calculate from invoice data
- **Smart Data Aggregation**: Excel files aggregate data by product/customer, PDFs extract line items
- **Missing Data Highlighting**: Visual indicators (red "Missing" badges) for null/undefined values
- **Duplicate Handling**: Automatic unique ID generation prevents React key conflicts
- **Edit Capabilities**: Modify product and customer metadata with auto-recalculation

---

## Data Flow Architecture

### 1. File Upload & Processing Flow

```mermaid
graph LR
    A[User Uploads File] --> B{File Type?}
    B -->|PDF/Image| C[readFileAsBase64]
    B -->|Excel| D[readExcelFileAsJson]
    C --> E[Send to Gemini API as base64]
    D --> F[Send to Gemini API as text]
    E --> G[Gemini Processes]
    F --> G
    G --> H[Returns Structured JSON]
    H --> I[Redux Stores Data]
    I --> J[UI Updates]
```

### 2. State Management Architecture

```typescript
Redux Store
├── app: {
│   status: 'idle' | 'loading' | 'succeeded' | 'failed',
│   error: string | null
│ }
├── invoices: Invoice[]           // Source of truth
├── products: Product[]           // Metadata + calculated totals
└── customers: Customer[]         // Metadata + aggregated amounts
```

**Key Design Decision**: Invoices are the **single source of truth**. Product quantities and customer totals are dynamically calculated from invoice data using memoized selectors.

### 3. Synchronization Mechanism

```typescript
// When product unitPrice is updated:
1. updateProduct() dispatched
2. invoicesSlice listens → recalculates affected invoice.totalAmount
3. selectCustomersWithCalculatedTotals recalculates customer totals
4. selectProductsWithCalculatedTotals recalculates product totals
5. All tabs update automatically 
```

**Implementation**: Redux Toolkit `extraReducers` + `createSelector` for memoized calculations.

---

## File Format Handling

### Why Different Approaches for Excel vs PDF/Images?

#### **PDF & Images** → Binary Base64 Encoding
- **Method**: `readFileAsBase64()` converts file to base64 string
- **API Format**: Sent as `inlineData` with MIME type
- **Reason**: Gemini API natively supports visual/document analysis
- **Use Case**: Extract data from single invoice documents

#### **Excel Files** → JSON Text Conversion
- **Method**: `readExcelFileAsJson()` converts to JSON using `xlsx` library
- **API Format**: Sent as plain text (Gemini doesn't support Excel as binary)
- **Reason**: Gemini API doesn't support Excel MIME types in `inlineData`
- **Use Case**: Aggregate multiple invoice line items

```typescript
// Excel uses text-based extraction
{
  parts: [
    { text: `Here is the Excel data in JSON format:\n\n${jsonData}\n\n${prompt}` }
  ]
}
```

### Prompt Engineering Strategy

#### **Aggregate Prompt** (Excel Files)
- Expects multiple line items
- Aggregates quantities by product
- Sums totals by customer
- Creates unique IDs per line item

#### **Direct Extraction Prompt** (PDF/Images)
- Extracts data from single invoice
- One entry per line item
- Maintains original structure
- Links all items to same serial number

---

## Edge Cases Handled

### 1. **Circular Dependency Prevention**
**Problem**: `store.tsx` imports reducers → reducers import `RootState` from `store.tsx` → Circular dependency crash

**Solution**: 
```typescript
// ❌ Before: Caused "Cannot access before initialization"
import { type RootState } from "@/app/store"
export const selector = (state: RootState) => state.products

// After: Use inline state typing
export const selector = (state: any) => state.products
```

### 2. **Empty File Content Detection**
**Problem**: User uploads valid file format but wrong content (e.g., resume instead of invoice)

**Solution**:
```typescript
if (response.invoices.length === 0 && 
    response.products.length === 0 && 
    response.customers.length === 0) {
  return rejectWithValue("No relevant data found...");
}
```

### 3. **Duplicate Serial Numbers**
**Problem**: Multiple products on same invoice → same serialNumber → React key conflicts

**Solution**: 
```typescript
// Generate unique composite IDs
"id": "INV-001-ProductName"  // serialNumber + productId
```

### 4. **Excel MIME Type Rejection**
**Problem**: Gemini API returns `400: Unsupported MIME type` for Excel files

**Solution**: Convert Excel to JSON text instead of sending as binary `inlineData`

### 5. **Missing Data Display**
**Problem**: AI returns `null` for missing fields → UI shows "undefined"

**Solution**:
```typescript
const renderCell = (data: string | number | null | undefined) => {
  if (data === null || data === undefined) {
    return <span className="text-red-500 font-semibold">Missing</span>;
  }
  return data;
};
```

### 6. **Data Synchronization**
**Problem**: Editing product price doesn't update invoice totals or customer totals

**Solution**: Implemented `extraReducers` to listen for product updates and recalculate invoices:
```typescript
.addCase(updateProduct, (state, action) => {
  state.invoices.forEach((invoice) => {
    if (invoice.productId === updatedProduct.id) {
      invoice.totalAmount = (invoice.qty × updatedProduct.unitPrice) + invoice.tax;
    }
  });
})
```

### 7. **Data Merging vs Replacement**
**Problem**: Users needed option to append new data or replace existing data

**Solution**: Implemented `addOrUpdate` logic in reducers:
```typescript
const addOrUpdateProducts = (state, newProducts) => {
  newProducts.forEach((newProduct) => {
    const index = state.products.findIndex(p => p.id === newProduct.id);
    if (index !== -1) {
      state.products[index] = newProduct;  // Update existing
    } else {
      state.products.push(newProduct);      // Add new
    }
  });
}
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Google Gemini API Key

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd swipe_invoice
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file in root directory
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

---

## Key Features Explained

### Real-Time Tab Synchronization

**Scenario**: Edit a product's name or price

```typescript
// Before: Data was disconnected
Products Tab:  "iPhone 16" → "iPhone 16 Pro"
Invoices Tab:  Still shows "iPhone 16" ❌

// After: Full synchronization
Products Tab:  "iPhone 16" → "iPhone 16 Pro"
Invoices Tab:  Updates to "iPhone 16 Pro" 
Customers Tab: Total purchase amount recalculates =
```

**Implementation**: Redux Toolkit selectors with automatic recomputation

### Dynamic Calculations

**Products Tab**:
```typescript
quantity = SUM(invoice.qty WHERE invoice.productId = product.id)
priceWithTax = SUM(invoice.totalAmount WHERE invoice.productId = product.id)
```

**Customers Tab**:
```typescript
totalPurchaseAmount = SUM(invoice.totalAmount WHERE invoice.customerId = customer.id)
```

### Data Merging Strategy

```typescript
// User clicks "Extract Data" on existing data:
- New products/customers with same ID → Updates existing entry
- New products/customers with different ID → Appends to list
- Invoices → Always appends (each line item unique)

// User clicks "Clear All Data":
- Clears all tabs completely
- Resets to initial state
```

---

## Testing the Application

### Test Case 1: Upload Excel File
1. Upload an Excel file with multiple invoices
2. Verify:
   - All line items appear in Invoices tab
   - Products show aggregated quantities
   - Customers show total purchase amounts

### Test Case 2: Edit Product Price
1. Go to Products tab
2. Edit a product's unit price
3. Go to Invoices tab → Total amounts should update
4. Go to Customers tab → Purchase totals should update

### Test Case 3: Dark Mode
1. Click sun/moon icon in header
2. Verify entire app switches theme
3. Refresh page → Theme persists

### Test Case 4: Multiple File Uploads
1. Upload first invoice file
2. Upload second invoice file without clearing
3. Verify data merges (updates existing, appends new)

---

## Problems Faced & Solutions

### Problem 1: Gemini API Base64 Decoding Error
**Error**: `Base64 decoding failed for "[\n  {\n    \"Party Name\"...`

**Root Cause**: Sending Excel JSON text as `inlineData.data` (expects base64)

**Solution**: Send Excel as text content, not binary:
```typescript
isTextData ? 
  [{ text: `${fileData}\n\n${prompt}` }] :  // Excel
  [{ inlineData: { mimeType, data: fileData } }, { text: prompt }]  // PDF/Image
```

### Problem 2: Invoice Totals Not Updating
**Issue**: Editing product price didn't recalculate invoice totals

**Root Cause**: Invoices stored static values, no listener for product changes

**Solution**: Added Redux listener to recalculate invoices when products update

### Problem 3: TypeScript Circular Dependencies
**Issue**: Store couldn't import from slices that import store types

**Solution**: Use inline typing `(state: any)` for selectors instead of `RootState`

---

## Bonus Features

### Beyond Assignment Requirements

1. **Category, SKU, Description** fields for products (3 bonus fields)
2. **Email, Company, Address** fields for customers (3 bonus fields)
3. **Dark mode** with system preference detection
4. **Toast notifications** for all user actions
5. **Responsive design** (mobile-friendly)
6. **Loading states** with disabled buttons
7. **Error boundaries** with helpful messages
8. **Gradient UI** with modern design system
9. **Memoized selectors** for performance optimization
10. **Edit dialogs** for both products and customers

---

## Future Enhancements

- [ ] Export data to Excel/PDF
- [ ] Advanced filtering and search
- [ ] Bulk edit capabilities
- [ ] Invoice template customization
- [ ] Multi-language support
- [ ] Offline mode with local storage
- [ ] Chart visualizations (revenue trends)
- [ ] Email invoice summaries
- [ ] API rate limiting and caching
- [ ] Unit and integration tests
---


## Contact

For questions or feedback, please open an issue in this repository.

---

**Open a PR lets work together 🙌**
