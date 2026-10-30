export type ProductCategory = 'arduino' | 'esp32' | 'modulos';

export interface Product {
  id: string | number;
  category: ProductCategory;
  name: string;
  price: number | string;
  description: string;
  image: string;
  active?: boolean;
}

export interface CartItem {
  productId: string | number;
  quantity: number;
}

export interface Category {
  key: ProductCategory;
  label: string;
}
