import React, { useState } from 'react';
import { Product } from '../app/types';
import BulkUploadProducts from './BulkUploadProducts';

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    _id: '',  // Default _id field
    id: '',   // Default id field
    title: '',
    description: '',
    price: 0,
    purchasePrice: 0,
    mrp: 0,
    sellingPrice: 0,
    gstTax: 0,
    stock: 0,
    brand: '',
    category: '',
    thumbnail: '',
    images: [],
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProduct({
        ...product,
        images: Array.from(e.target.files),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/product/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const data = await response.json();
      console.log('Product added:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='m-10'>
        <h4><b>Add single product</b></h4>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Brand</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          className="mt-1 p-2 border w-full"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Purchase Price</label>
          <input
            type="number"
            name="purchasePrice"
            value={product.purchasePrice}
            onChange={handleChange}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">MRP</label>
          <input
            type="number"
            name="mrp"
            value={product.mrp}
            onChange={handleChange}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Selling Price</label>
          <input
            type="number"
            name="sellingPrice"
            value={product.sellingPrice}
            onChange={handleChange}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Thumbnail</label>
          <input
            type="text"
            name="thumbnail"
            value={product.thumbnail}
            onChange={handleChange}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Images</label>
          <input
            type="file"
            name="images"
            onChange={handleImagesChange}
            multiple
            className="mt-1 p-2 border w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto mt-4"
      >
        Add Product
      </button>
    </form>
    <BulkUploadProducts/>
    </div>
  );
};

export default ProductForm;
