import type { ReceiptResponse } from "../types/receipt"
import { apiClient } from "./apiClient"

// ดึงใบเสร็จจาก order_id
export const getReceipt = async (orderId: string) => {
    return apiClient<ReceiptResponse>(`/orders/${orderId}/receipt`)
} 