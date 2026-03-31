// src/utils/supabaseClient.ts
// Install: npm install @supabase/supabase-js
//
// Add to your .env file:
//   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key
//   VITE_CASHFREE_APP_ID=your_cashfree_app_id
//   VITE_CASHFREE_SECRET_KEY=your_cashfree_secret_key
//   VITE_WHATSAPP_API_KEY=your_aisensy_api_key

import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnon);

// ── Types — exactly match your existing orders table columns ──────────────────

export interface Order {
  id?:                 string;       // uuid, auto-generated
  amount:              number;       // numeric
  full_name:           string | null;
  email:               string | null;
  phone_number:        string | null;
  profession:          string | null;
  remarks:             string | null;
  additional_products: string[];     // text[]
  payment_status:      string;       // 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'
  cashfree_order_id:   string | null;
  coupon_code:         string | null;
  coupon_discount:     number;       // ₹ discount amount (not percentage)
  created_at?:         string;
}

// ── Insert a new order row ────────────────────────────────────────────────────

export async function insertOrder(
  order: Omit<Order, "id" | "created_at">
): Promise<{ data: Order | null; error: string | null }> {
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Order, error: null };
}

// ── Update payment_status by cashfree_order_id ───────────────────────────────

export async function updateOrderStatus(
  cashfreeOrderId: string,
  paymentStatus: "PAID" | "FAILED" | "CANCELLED"
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("cashfree_order_id", cashfreeOrderId);

  return { error: error?.message ?? null };
}

// ── Fetch a single order by cashfree_order_id ────────────────────────────────

export async function getOrderByCashfreeId(
  cashfreeOrderId: string
): Promise<{ data: Order | null; error: string | null }> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("cashfree_order_id", cashfreeOrderId)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Order, error: null };
}