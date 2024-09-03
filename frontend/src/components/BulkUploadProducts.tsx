import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const BulkUploadProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setProducts(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(products),
      });

      if (!response.ok) {
        throw new Error('Failed to upload products');
      }

      const data = await response.json();
      console.log('Bulk upload successful:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bulk-upload-container p-4">
      <h2 className="text-lg font-bold mb-4">Bulk Upload Products</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {fileName && (
        <p className="text-sm text-gray-500 mb-4">Selected file: {fileName}</p>
      )}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={products.length === 0}
      >
        Upload Products
      </button>
    </div>
  );
};

export default BulkUploadProducts;
