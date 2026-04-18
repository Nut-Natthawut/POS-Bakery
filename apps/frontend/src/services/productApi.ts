import { apiClient } from "./apiClient"
import type { CreateProductResponse, DeleteProductResponse, GetProductsResponse, UpdateProductResponse } from "../types/product"

// ดึงรายการสินค้าทั้งหมดจาก backend
export const getProducts = () => {
  return apiClient<GetProductsResponse>("/products")
}

// สร้างสินค้าใหม่ โดยส่งข้อมูลแบบ FormData เพราะอาจมีรูปภาพ
export const createProduct = (formData: FormData) => {
  return apiClient<CreateProductResponse>("/products", {
    method: "POST",
    body: formData,
  })
}

// แก้ไขสินค้าเดิม โดยส่งข้อมูลแบบ FormData เพราะอาจเปลี่ยนรูปภาพได้
export const updateProduct = (id: string, formData: FormData) => {
  return apiClient<UpdateProductResponse>(`/products/${id}`, {
    method: "PUT",
    body: formData,
  })
}

export const deleteProduct = (id: string) => {
  return apiClient<DeleteProductResponse>(`/products/${id}`, {
    method: "DELETE",
  })
}