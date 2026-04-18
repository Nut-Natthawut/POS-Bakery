import { apiClient } from "./apiClient"
import type { ProductsResponse } from "../types/product"

// ดึงรายการสินค้าทั้งหมดจาก backend
export const getProducts = () => {
  return apiClient<ProductsResponse>("/products")
}
