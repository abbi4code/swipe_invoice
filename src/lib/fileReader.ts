import * as XLSX from 'xlsx'


// read file (image, pdf) & return it as a base64 encoded data URL
export const readFileAsBase64 = (file: File): Promise<string> =>{
    return new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // result would be like "data:image/png;base64,iVBORw0KG..."
            // jst need to get that bse64 part
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]);
        }
        reader.onerror = (error) => reject(error)
    })
}

// Reads an excel file (.xlsx) and return its content as a JSON string
export const readExcelFileAsJson = (file: File): Promise<string> => {
    return new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array'});
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                resolve(JSON.stringify(json,null,2));
                
            } catch (error) {
                reject(error)
            }
        }
        reader.onerror = (error) => reject(error);
    })
}

