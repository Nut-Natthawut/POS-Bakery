import { apiClient } from "./apiClient"
import type { LoginRequest, LoginResponse } from "../types/auth"

// คุยกับ API login ของ backend
export const login = (payload: LoginRequest) => {
  return apiClient<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
