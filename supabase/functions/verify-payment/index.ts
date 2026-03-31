// supabase/functions/verify-payment/index.ts
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
};
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const {
      orderId,
      statusOverride,
      amount,
      fullName,
      email,
      phoneNumber,
      profession,
      remarks,
      additionalProducts,
      couponCode,
      couponDiscount,
    } = body;

    // 🔐 ENV
    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID");
    const CASHFREE_SECRET = Deno.env.get("CASHFREE_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!);

    let finalStatus = "PENDING";

    // ❌ CASE: Abandoned / Cancel
    if (statusOverride === "ABANDONED") {
      finalStatus = "ABANDONED";
    } else {
      // 🔍 Verify from Cashfree
      const res = await fetch(
        `https://api.cashfree.com/pg/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            "x-client-id": CASHFREE_APP_ID!,
            "x-client-secret": CASHFREE_SECRET!,
            "x-api-version": "2022-09-01",
          },
        }
      );

      const data = await res.json();

      console.log("Cashfree verify:", data);

      if (data.order_status === "PAID") {
        finalStatus = "PAID";
      } else if (data.order_status === "ACTIVE") {
        finalStatus = "PENDING";
      } else {
        finalStatus = "FAILED";
      }
    }

    // 🧾 Insert NEW row (no updates ever)
    const { data: inserted } = await supabase
      .from("orders")
      .insert([
        {
          order_id: orderId,
          amount,
          status: finalStatus,
          full_name: fullName,
          email,
          phone_number: phoneNumber,
          profession,
          remarks,
          additional_products: additionalProducts,
          coupon_code: couponCode,
          coupon_discount: couponDiscount,
        },
      ])
      .select()
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        status: finalStatus,
        supabaseRowId: inserted.id,
      }),
      {  headers: corsHeaders,status: 200 }
    );
  } catch (err) {
    console.error("verify-payment error:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {  headers: corsHeaders,status: 500 }
    );
  }
});