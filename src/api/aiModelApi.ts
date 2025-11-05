import axios from 'axios';
import { type Invoice, type Product, type Customer } from '@/types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;



// expected str of the JSON response from AI
export interface ExtractionResponse {
    invoices: Invoice[],
    customers: Customer[],
    products: Product[]
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
    isTextData: boolean = false
): Promise<ExtractionResponse> => {

    const prompt = `
    You are an expert data extraction assistant for a billing application.
    Analyze the provided file content and extract all relevant information for invoices, products, and customers.

    **INSTRUCTIONS:**
    1.  Analyze the input data.
    2.  Identify all unique invoices, unique products, and unique customers.
    3.  For Products and Customers, use their names as their unique "id".
    4.  For Invoices, use the "customerId" and "productId" fields to link to the corresponding product and customer names.
    5.  If any piece of information is missing from the file, you **MUST** use \`null\` for that field. Do not invent data.
    6.  Return a single, valid JSON object with three keys: "invoices", "products", "customers".
    7.  The date format for invoices must be YYYY-MM-DD. If no date is found, use null.
    
    **REQUIRED JSON OUTPUT FORMAT:**
    \`\`\`json
    {
      "invoices": [
        {
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
          "quantity": "number or null",
          "unitPrice": "number or null",
          "tax": "number or null",
          "priceWithTax": "number or null"
        }
      ],
      "customers": [
        {
          "id": "string (customer name)",
          "customerName": "string",
          "phoneNumber": "string or null",
          "totalPurchaseAmount": "number or null"
        }
      ]
    }
    \`\`\`
  `;

  const parts = isTextData
    ? [
        // For Excel: send as text content
        { text: `Here is the Excel data in JSON format:\n\n${fileData}\n\n${prompt}` }
      ]
    : [
        // For PDF/Images: send as binary inlineData
        { inlineData: { mimeType, data: fileData } },
        { text: prompt }
      ];

  const requestBody = {
    contents: [
        {
            parts: parts
        }
    ],
    // ensure we get a JSON res
    generationConfig: {
        responseMimeType: "application/json"
    }
  }

  try {
    const response = await axios.post(API_URL, requestBody, {
        headers: {'Content-Type': 'application/json'}
    })
    console.log("Immediate Response from AI",response)

    const jsonString = response.data.candidates[0].content.parts[0].text;
    console.log("AI jsonstring",jsonString)

    const parsedData: ExtractionResponse = JSON.parse(jsonString);

    return parsedData
  } catch (error) {
    console.error("Error calling genemi API:", error)

    if(axios.isAxiosError(error) && error.response){
        throw new Error(
            `API error: ${error.response.status} - ${JSON.stringify(error.response
                .data
            )}`
        )
    }
    throw new Error("Failed to extract data from the file.")
    
  }
}