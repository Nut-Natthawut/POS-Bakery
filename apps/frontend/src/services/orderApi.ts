import { apiClient } from "./apiClient"
import type { CreateOrderPayload, CreateOrderResponse } from "../types/order"

// ส่ง order ไป backend
export const createOrder = (payload: CreateOrderPayload) => {
  return apiClient<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload)
  })
}
