// ข้อมูลสินค้าในตะกร้าฝั่ง frontend
export interface CartItem {
  product_id: string
  name: string
  price: number
  discount_price: number | null
  vat_rate: number
  stock: number
  image_url: string | null
  quantity: number
}

// payload ที่ส่งไป backend ตอน checkout
export interface CreateOrderPayload {
  items: {
    product_id: string
    quantity: number
  }[]
}

// response ที่ backend ส่งกลับหลัง checkout สำเร็จ
export interface CreateOrderResponse {
  message: string
  data: {
    order_id: string
    subtotal: number
    total_discount: number
    total_vat: number
    grand_total: number
  }
}