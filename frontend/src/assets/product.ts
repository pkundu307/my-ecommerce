// src/types/Product.ts
export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    images: string[];
  }
  
  export type ProductDetails = {
    [key: number]: Product;
  };
  