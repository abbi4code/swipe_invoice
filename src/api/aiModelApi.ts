import axios from "axios";
import { type Invoice, type Product, type Customer } from "@/types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export interface ExtractionResponse {
  invoices: Invoice[];
  customers: Customer[];
  products: Product[];
}

/**
 * sends file content and prompt to ai api
 * @param fileData: base64-encoded string (for PDFs/images) or JSON string (for Excel)
 * @param mimeType: mime type of the file (e.g., "image/png", "application/pdf", "text/plain")
 * @param isTextData: true if fileData is text (Excel JSON), false if it's base64 binary (PDF/image)
 * @returns parsed JSON object { invoices, products, customers }
 */

export const callModalApi = async (
  fileData: string,
  mimeType: string,
  isTextData: boolean = false,
  fileType: string
): Promise<ExtractionResponse> => {
  let prompt: string;

  // for excel files
  const PROMPT_AGGREGATE = `
You are an expert data normalization and extraction assistant.
The user has provided a file that is a LIST OF INVOICE LINE ITEMS (e.g., an Excel/CSV report).
Your task is to analyze this list and transform it into three separate, clean JSON arrays.

**CRITICAL RULES:**
1.  If any information is missing, use \`null\`.
2.  Product and Customer names are the unique IDs.
3.  Follow the EXACT field names specified below.

---
**REQUIRED JSON OUTPUT FORMAT:**
\`\`\`json
{
  "invoices": [
    {
      "id": "string (unique - combine serialNumber-productId)",
      "serialNumber": "string",
      "customerId": "string (customer name)",
      "productId": "string (product name)",
      "qty": "number or null",
      "tax": "number or null",
      "totalAmount": "number or null",
      "date": "string (YYYY-MM-DD) or null"
    }
  ],
  "products": [
    {
      "id": "string (product name)",
      "name": "string",
      "quantity": "number or null (SUM of all qty for this product)",
      "unitPrice": "number or null",
      "tax": "number or null (SUM of all tax for this product)",
      "priceWithTax": "number or null (SUM of all totalAmount for this product)",
      "discount": "number or null (optional)",
      "category": "string or null (optional, e.g., Electronics, Food)",
      "sku": "string or null (optional, stock keeping unit)",
      "description": "string or null (optional)"
    }
  ],
  "customers": [
    {
      "id": "string (customer name)",
      "customerName": "string",
      "phoneNumber": "string or null",
      "totalPurchaseAmount": "number or null (SUM of all totalAmount for this customer)",
      "email": "string or null (optional)",
      "companyName": "string or null (optional)",
      "address": "string or null (optional)"
    }
  ]
}
\`\`\`

**AGGREGATION RULES:**
- **invoices**: Include ALL line items with unique \`id\`
- **products**: One entry per unique product, aggregate quantity and totalAmount
- **customers**: One entry per unique customer, aggregate totalAmount
`;

  // for pdf && img
  const PROMPT_DIRECT_EXTRACTION = `
You are an expert data extraction assistant.
The user has provided a SINGLE INVOICE document (a PDF or JPG image).
Your task is to extract the data and transform it into three separate JSON arrays.

**CRITICAL RULES:**
1.  If any information is missing, use \`null\`.
2.  Product and Customer names are the unique IDs.
3.  Follow the EXACT field names specified below.

---
**REQUIRED JSON OUTPUT FORMAT:**
\`\`\`json
{
  "invoices": [
    {
      "id": "string (unique - combine serialNumber-productId)",
      "serialNumber": "string (main invoice number)",
      "customerId": "string (customer name)",
      "productId": "string (product name)",
      "qty": "number or null",
      "tax": "number or null",
      "totalAmount": "number or null (line item total)",
      "date": "string (YYYY-MM-DD) or null"
    }
  ],
  "products": [
    {
      "id": "string (product name)",
      "name": "string",
      "quantity": "number or null",
      "unitPrice": "number or null",
      "tax": "number or null",
      "priceWithTax": "number or null (line item total)",
      "discount": "number or null (optional)",
      "category": "string or null (optional, e.g., Electronics, Food)",
      "sku": "string or null (optional, stock keeping unit)",
      "description": "string or null (optional)"
    }
  ],
  "customers": [
    {
      "id": "string (customer name)",
      "customerName": "string",
      "phoneNumber": "string or null",
      "totalPurchaseAmount": "number or null (invoice grand total)",
      "email": "string or null (optional)",
      "companyName": "string or null (optional)",
      "address": "string or null (optional)"
    }
  ]
}
\`\`\`

**EXTRACTION RULES:**
- **invoices**: One entry per line item with unique \`id\`, same \`serialNumber\` and \`customerId\` for all items
- **products**: One entry per unique product on this invoice
- **customers**: ONE entry for the customer on this invoice
`;

  if (fileType.includes("spreadsheetml") || fileType.includes("excel") || mimeType === 'text/plain') {
    prompt = PROMPT_AGGREGATE;
  } else {
    prompt = PROMPT_DIRECT_EXTRACTION;
  }

  const parts = isTextData
    ? [
        // For Excel: send as text content
        {
          text: `Here is the Excel data in JSON format:\n\n${fileData}\n\n${prompt}`,
        },
      ]
    : [
        // For PDF/Images: send as binary inlineData
        { inlineData: { mimeType, data: fileData } },
        { text: prompt },
      ];

  const requestBody = {
    contents: [
      {
        parts: parts,
      },
    ],
    // ensure we get a JSON res
    generationConfig: {
      responseMimeType: "application/json",
    },
  };

  try {
    const response = await axios.post(API_URL, requestBody, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Immediate Response from AI", response);

    const jsonString = response.data.candidates[0].content.parts[0].text;
    console.log("AI jsonstring", jsonString);

    const parsedData: ExtractionResponse = JSON.parse(jsonString);

    return parsedData;
  } catch (error) {
    console.error("Error calling genemi API:", error);

    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `API error: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`
      );
    }
    throw new Error("Failed to extract data from the file.");
  }
};
