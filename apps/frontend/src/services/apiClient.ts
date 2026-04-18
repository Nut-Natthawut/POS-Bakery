const API_BASE_URL = "http://localhost:3000"

//fetch กลาง ตั้ง base URL, headers, error handling
export const apiClient = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  // ดึง token ที่ได้จากหน้า Login เพื่อใช้กับ API ที่ต้อง login
  const token = localStorage.getItem("accessToken")

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  // อ่าน response JSON จาก backend
  const data = await response.json()

  // ถ้า request ไม่สำเร็จ ให้โยน message จาก backend ไปที่ catch UI
  if (!response.ok) {
    throw new Error(data.message || "Request failed")
  }

  // ถ้าสำเร็จ ส่ง response data กลับไปใช้งาน service/page
  return data as T
}
