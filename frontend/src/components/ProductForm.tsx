import React, { useState } from 'react';
import { Product } from '../app/types';

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
    thumbnail: '',  // To hold the thumbnail URL
    images: [],  // To hold files
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // For image previews
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null); // For thumbnail preview
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({
    thumbnail: null,
    image1: null,
    image2: null,
    image3: null,
  });

  // Handle input changes for product details
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image file selection and generate previews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files) {
      const file = e.target.files[0];

      setSelectedFiles(prev => ({
        ...prev,
        [key]: file,
      }));

      const preview = URL.createObjectURL(file);

      if (key === 'thumbnail') {
        setThumbnailPreview(preview);
      } else {
        setImagePreviews(prev => {
          const newPreviews = [...prev];
          const index = Number(key.replace('image', '')) - 1;
          newPreviews[index] = preview;
          return newPreviews;
        });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    
    // Append product details to form data
    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('purchasePrice', product.purchasePrice.toString());
    formData.append('mrp', product.mrp.toString());
    formData.append('sellingPrice', product.sellingPrice.toString());
    formData.append('category', product.category);
    formData.append('stock', product.stock.toString());
    formData.append('brand', product.brand);

    // Append images to form data
    for (const [key, file] of Object.entries(selectedFiles)) {
      if (file) {
        formData.append(key, file, file.name);
      }
    }

    try {
      const response = await fetch('http://localhost:5000/api/product/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,  // Send form data containing images and product details
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
    <div className="m-10">
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
          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium">Thumbnail</label>
            <div className="relative">
              <input
                type="file"
                name="thumbnail"
                onChange={(e) => handleFileChange(e, 'thumbnail')}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
              <div className="w-full h-32 border border-dashed border-gray-400 flex items-center justify-center">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">+ Upload Thumbnail</span>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload Sections */}
          {['image1', 'image2', 'image3'].map((key, index) => (
            <div key={key}>
              <label className="block text-sm font-medium">Image {index + 1}</label>
              <div className="relative">
                <input
                  type="file"
                  name={key}
                  onChange={(e) => handleFileChange(e, key)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <div className="w-full h-32 border border-dashed border-gray-400 flex items-center justify-center">
                  {imagePreviews[index] ? (
                    <img src={imagePreviews[index]} alt={`Image ${index + 1} Preview`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500">+ Upload Image {index + 1}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto mt-4"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
