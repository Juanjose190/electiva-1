export interface User {
  id: number;
  name: string;
  lastName: string;
  username: string;
  phone: string;
  status: boolean;
}

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  description: string;
  iva: number;
  categoryId: number;
  status: boolean;
}

export interface Category {
  id: number;
  description: string;
  status: boolean;
}

export interface Client {
  id: number;
  name: string;
  lastName: string;
  identification: string;
  phone: string;
  address: string;
  status: boolean;
}

export interface Sale {
  id: number;
  clientId: number;
  total: number;
  date: string;
  status: boolean;
  items: SaleItem[];
}

export interface SaleItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
  discount: number;
  iva: number;
  total: number;
}