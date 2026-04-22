import { supabase } from "../lib/supabase";
import type {
  BestSellerItem,
  DashboardSummary
} from "../types/dashboard.type";

// ดึงข้อมูล dashboard ของเดือนปัจจุบัน
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString();

  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toISOString();

  // ดึง orders ของเดือนปัจจุบันเพื่อสรุป revenue และ vat
  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select(`
      id,
      grand_total,
      total_vat
    `)
    .gte("created_at", startOfMonth)
    .lt("created_at", startOfNextMonth);

  if (ordersError) {
    throw new Error(ordersError.message);
  }

  const revenue =
    ordersData?.reduce((sum, order) => sum + Number(order.grand_total), 0) ?? 0;

  const totalVat =
    ordersData?.reduce((sum, order) => sum + Number(order.total_vat), 0) ?? 0;

  const orderIds = ordersData?.map((order) => order.id) ?? [];

  if (orderIds.length === 0) {
    return {
      revenue,
      total_vat: totalVat,
      best_sellers: []
    };
  }

  // ดึง order_items ของ order ในเดือนนี้
  const { data: orderItemsData, error: orderItemsError } = await supabase
    .from("order_items")
    .select(`
      product_id,
      quantity,
      products (
        name
      )
    `)
    .in("order_id", orderIds);

  if (orderItemsError) {
    throw new Error(orderItemsError.message);
  }

  // รวมยอดขายต่อสินค้า
  const productMap = new Map<string, BestSellerItem>();

  for (const item of orderItemsData ?? []) {
    const productRelation = item.products as
      | { name: string }
      | { name: string }[]
      | null;

    const productName = Array.isArray(productRelation)
      ? (productRelation[0]?.name ?? "Unknown product")
      : (productRelation?.name ?? "Unknown product");

    const existingProduct = productMap.get(item.product_id);

    if (!existingProduct) {
      productMap.set(item.product_id, {
        product_id: item.product_id,
        product_name: productName,
        total_quantity: item.quantity
      });

      continue;
    }

    existingProduct.total_quantity += item.quantity;
  }

  const bestSellers = Array.from(productMap.values())
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, 5);

  return {
    revenue,
    total_vat: totalVat,
    best_sellers: bestSellers
  };
};
