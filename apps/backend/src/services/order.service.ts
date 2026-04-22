import { supabase } from "../lib/supabase";
import type { CreateOrderInput, CreateOrderResult } from "../types/order.type";
import type { JwtPayload } from "../types/auth.type";
import type { OrderHistoryItem } from "../types/order.type";


export const createOrder = async (
  userId: string,
  input: CreateOrderInput
) => {
  const { data, error } = await supabase.rpc("create_order", {
    p_user_id: userId,
    p_items: input.items
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as CreateOrderResult;
};

export const getOrderHistory = async (
  user: JwtPayload,
  startDate?: string,
  endDate?: string
): Promise<OrderHistoryItem[]> => {
  // ดึง order พร้อมชื่อคนขาย
  let query = supabase
    .from("orders")
    .select(`
      id,
      user_id,
      total_vat,
      total_discount,
      grand_total,
      created_at,
      users (
        username
      ),
      order_items (
        quantity
      )
    `)
    .order("created_at", { ascending: false });

  // ถ้าเป็น staff ให้เห็นเฉพาะ order ของตัวเอง
  if (user.role === "STAFF") {
    query = query.eq("user_id", user.id);
  }

  // กรองวันเริ่มต้น
  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  // กรองวันสิ้นสุด
  if (endDate) {
    query = query.lte("created_at", endDate);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((order) => {
    const sellerRelation = order.users as
      | { username: string }
      | { username: string }[]
      | null;

    const sellerName = Array.isArray(sellerRelation)
      ? (sellerRelation[0]?.username ?? "Unknown seller")
      : (sellerRelation?.username ?? "Unknown seller");

    const orderItemsRelation = order.order_items as
      | { quantity: number }[]
      | null;

    const itemCount = orderItemsRelation?.length ?? 0;
    const totalQuantity =
      orderItemsRelation?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return {
      order_id: order.id,
      seller_name: sellerName,
      grand_total: Number(order.grand_total),
      total_vat: Number(order.total_vat),
      total_discount: Number(order.total_discount),
      created_at: order.created_at,
      item_count: itemCount,
      total_quantity: totalQuantity
    };
  });
};
