import generatePayload from "promptpay-qr";
import { supabase } from "../lib/supabase";
import type { ReceiptData, ReceiptItem } from "../types/receipt.type";

type SellerRelation = {
  username: string;
} | {
  username: string;
}[] | null;

type ProductRelation = {
  name: string;
} | {
  name: string;
}[] | null;

export const getReceiptByOrderId = async (
  orderId: string
): Promise<ReceiptData> => {
  const promptpayMobile = process.env.PROMPTPAY_MOBILE;

  if (!promptpayMobile) {
    throw new Error("PromptPay mobile is not configured");
  }

  // ดึง order หลักและชื่อคนขาย
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select(`
      id,
      subtotal,
      total_discount,
      total_vat,
      grand_total,
      users (
        username
      )
    `)
    .eq("id", orderId)
    .single();

  if (orderError) {
    if (orderError.code === "PGRST116") {
      throw new Error("Order not found");
    }

    throw new Error(orderError.message);
  }

  if (!orderData) {
    throw new Error("Order not found");
  }

  // ดึงรายการสินค้าในบิลและชื่อสินค้า
  const { data: orderItemsData, error: orderItemsError } = await supabase
    .from("order_items")
    .select(`
      product_id,
      quantity,
      price_at_sale,
      vat_at_sale,
      products (
        name
      )
    `)
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (orderItemsError) {
    throw new Error(orderItemsError.message);
  }

  const items: ReceiptItem[] = (orderItemsData ?? []).map((item) => {
    const productRelation = item.products as ProductRelation;

    const productName = Array.isArray(productRelation)
      ? (productRelation[0]?.name ?? "Unknown product")
      : (productRelation?.name ?? "Unknown product");

    return {
      product_id: item.product_id,
      product_name: productName,
      quantity: item.quantity,
      price_at_sale: Number(item.price_at_sale),
      vat_at_sale: Number(item.vat_at_sale)
    };
  });

  const sellerRelation = orderData.users as SellerRelation;

  const sellerName = Array.isArray(sellerRelation)
    ? (sellerRelation[0]?.username ?? "Unknown seller")
    : (sellerRelation?.username ?? "Unknown seller");

  // สร้าง payload พร้อมเพย์จากยอดสุทธิของบิล
  const promptpayPayload = generatePayload(promptpayMobile, {
    amount: Number(orderData.grand_total)
  });

  return {
    order_id: orderData.id,
    seller_name: sellerName,
    items,
    subtotal: Number(orderData.subtotal),
    total_discount: Number(orderData.total_discount),
    total_vat: Number(orderData.total_vat),
    grand_total: Number(orderData.grand_total),
    promptpay_payload: promptpayPayload
  };
};
