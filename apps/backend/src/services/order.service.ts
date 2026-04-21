import { supabase } from "../lib/supabase";
import type { CreateOrderInput, CreateOrderResult } from "../types/order.type";

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
