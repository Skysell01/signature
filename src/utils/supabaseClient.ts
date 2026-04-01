import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnon);

export interface Order {
  id?:                 string;
  order_id:            string | null;   // matches DB: text
  amount:              number;
  status:              string;          // matches DB: 'PENDING' | 'PAID' | 'FAILED'
  full_name:           string | null;
  email:               string | null;
  phone_number:        string | null;
  profession:          string | null;
  remarks:             string | null;
  additional_products: string[];
  coupon_code:         string | null;
  coupon_discount:     number;
  created_at?:         string;
}

export async function updateOrderStatus(
  orderId: string,
  status: "PAID" | "FAILED" | "CANCELLED"
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("order_id", orderId);

  return { error: error?.message ?? null };
}

export async function getOrderByOrderId(
  orderId: string
): Promise<{ data: Order | null; error: string | null }> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Order, error: null };
}