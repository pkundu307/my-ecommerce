import React from 'react';
import { useParams } from 'react-router-dom';
import { Product, ProductDetails } from '../assets/product';

// Sample product details (replace with actual data fetching logic)
const productDetails: ProductDetails = {
  1: {
    id: 1,
    name: 'Product 1',
    description: 'This is the detailed description for Product 1.',
    price: '$100',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150/0000FF/808080',
      'https://via.placeholder.com/150/FF0000/FFFFFF',
    ],
  },
  2: {
    id: 2,
    name: 'Product 2',
    description: 'This is the detailed description for Product 2.',
    price: '$200',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150/0000FF/808080',
      'https://via.placeholder.com/150/FF0000/FFFFFF',
    ],
  },
  // Add more products as needed
};

function ProductDetail() {
  const { id } = useParams<{ id: string }>(); // Type the useParams hook to expect a string id
  const product = productDetails[Number(id)]; // Convert the id to a number to match productDetails keys

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

      {/* Display product images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {product.images.map((image, index) => (
          <img key={index} src={image} alt={`Product ${index + 1}`} className="w-full h-48 object-cover rounded" />
        ))}
      </div>

      {/* Product description */}
      <p className="text-gray-600 mt-4">{product.description}</p>
      <p className="text-blue-500 font-bold mt-2">{product.price}</p>
    </div>
  );
}

export default ProductDetail;
