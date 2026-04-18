import { apiClient } from "./apiClient"
import type { CategoriesResponse } from "../types/category"

// ดึงหมวดหมู่ทั้งหมด เพื่อใช้แสดงชื่อหมวดหมู่และใช้ในฟอร์มสินค้า
export const getCategories = () => {
  return apiClient<CategoriesResponse>("/categories")
}
