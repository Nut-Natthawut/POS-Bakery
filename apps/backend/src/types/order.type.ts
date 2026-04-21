// รายการสินค้าที่ frontend ส่งมาเพื่อสร้าง order
export interface CreateOrderItemInput {
  product_id: string;
  quantity: number;
}

// body หลักของ POST /orders
export interface CreateOrderInput {
  items: CreateOrderItemInput[];
}

// ผลลัพธ์ที่ได้จาก RPC create_order หลังสร้าง order สำเร็จ
export interface CreateOrderResult {
  order_id: string;
  subtotal: number;
  total_discount: number;
  total_vat: number;
  grand_total: number;
}

// หน้าตาข้อมูลในตาราง orders
export interface Order {
  id: string;
  user_id: string;
  subtotal: number;
  total_vat: number;
  total_discount: number;
  grand_total: number;
  created_at: string;
}

// หน้าตาข้อมูลในตาราง order_items
// เก็บราคาและ VAT ณ ตอนขาย เพื่อไม่ให้บิลเก่าเพี้ยนเมื่อราคาสินค้าเปลี่ยน
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_sale: number;
  vat_at_sale: number;
  created_at: string;
}
