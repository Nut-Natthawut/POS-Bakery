export type Product = {
  id: string
  category_id: string
  name: string
  price: number
  stock: number
  vat_rate: number
  discount_price: number | null
  image_url: string | null
  created_at: string
}

export type ProductsResponse = {
  message: string
  data: Product[]
}

export type ProductResponse = {
  message: string
  data: Product
}

export type DeleteProductResponse = {
  message: string
  data: {
    id: string
  }
}
