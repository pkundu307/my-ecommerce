import { CartState } from "./cartSlice";
export interface UserState {
    user: {
      id: string;
      name: string;
      email: string;
    } | null;
  }

// src/types/Product.ts
export interface Product {
  _id:string;
  id: string;
  title: string;
  description: string;
  price: number;
  purchasePrice: number;
  mrp: number;
  sellingPrice: number;
  gstTax: number;
  discountPercentage?: number;
  rating?: number;
  seller_id?: string;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: File[];
  colors?: string[];
  sizes?: string[];
  highlights?: string[];
  coupon?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  manufacturer?: string;
  supplier?: string;
}

export interface RootState {
    cart: CartState
    user: UserState;
  }