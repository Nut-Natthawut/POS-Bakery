import { apiClient } from "./apiClient"
import type { LoginRequest, LoginResponse } from "../types/auth"

// คุยกับ API login/logout/profile
export const login = (payload: LoginRequest) => {
  return apiClient<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
