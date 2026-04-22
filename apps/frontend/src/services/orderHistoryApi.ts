import { apiClient } from "./apiClient"
import type { OrderHistoryResponse } from "../types/orderHistory"


// ดึงประวัติบิลย้อนหลัง พร้อม filter วันที่
export const getOrderHistory = (
  startDate?: string,
  endDate?: string
) => {
  const params = new URLSearchParams()

  if (startDate) {
    params.set("startDate", startDate)
  }

  if (endDate) {
    params.set("endDate", endDate)
  }

  const queryString = params.toString()
  const path = queryString
    ? `/orders/history?${queryString}`
    : "/orders/history"

  return apiClient<OrderHistoryResponse>(path)
}
