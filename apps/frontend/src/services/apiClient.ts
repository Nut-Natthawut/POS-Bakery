const API_BASE_URL = "http://localhost:3000"

//fetch กลาง ตั้ง base URL, headers, error handling
export const apiClient = async <T>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  // อ่าน response JSON จาก backend
  const data = await response.json()

  // ถ้า request ไม่สำเร็จ ให้โยน message จาก backend ไปที่ catch
  if (!response.ok) {
    throw new Error(data.message || "Request failed")
  }

  // ถ้าสำเร็จ ส่ง response data กลับไปใช้งาน
  return data as T
}
