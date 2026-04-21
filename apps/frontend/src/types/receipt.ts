export interface ReceiptItem {
  product_id: string
  product_name: string
  quantity: number
  price_at_sale: number
  vat_at_sale: number
}

export interface ReceiptData {
  order_id: string
  seller_name: string
  items: ReceiptItem[]
  subtotal: number
  total_discount: number
  total_vat: number
  grand_total: number
  promptpay_payload: string
}

export interface ReceiptResponse {
  message: string
  data: ReceiptData
}
