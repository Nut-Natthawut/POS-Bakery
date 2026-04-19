import { apiClient } from "./apiClient"
import type { CreateCategoryResponse, DeleteCategoryResponse, GetCategoriesResponse, UpdateCategoryResponse } from "../types/category"

// ดึงหมวดหมู่ทั้งหมด เพื่อใช้แสดงชื่อหมวดหมู่และใช้ในฟอร์มสินค้า
export const getCategories = () => {
  return apiClient<GetCategoriesResponse>("/categories")
}

// สร้างหมวดหมู่ใหม่
export const createCategory = (payload: { name: string }) => {
  return apiClient<CreateCategoryResponse>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// อัปเดตหมวดหมู่
export const updateCategory = (id: string, payload: { name: string }) => {
  return apiClient<UpdateCategoryResponse>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

// ลบหมวดหมู่
export const deleteCategory = (id: string) => {
  return apiClient<DeleteCategoryResponse>(`/categories/${id}`, {
    method: "DELETE",
  })
}