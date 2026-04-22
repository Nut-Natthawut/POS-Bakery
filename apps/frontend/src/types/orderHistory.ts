export interface OrderHistoryItem {
  order_id: string
  seller_name: string
  grand_total: number
  total_vat: number
  total_discount: number
  created_at: string
  item_count: number
}

export interface OrderHistoryResponse {
  message: string
  data: OrderHistoryItem[]
}
