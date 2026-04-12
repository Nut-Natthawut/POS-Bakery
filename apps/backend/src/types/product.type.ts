export interface Product {
  id: string;
  category_id: string;
  name: string;
  price: number;
  stock: number;
  vat_rate: number;
  discount_price: number | null;
  image_url: string | null;
  created_at: string;
}

export interface CreateProductInput {
  category_id: string;
  name: string;
  price: number;
  stock: number;
  vat_rate: number;
  discount_price?: number | null;
  image_url?: string | null;
}

export interface UpdateProductInput {
  category_id?: string;
  name?: string;
  price?: number;
  stock?: number;
  vat_rate?: number;
  discount_price?: number | null;
  image_url?: string | null;
}
