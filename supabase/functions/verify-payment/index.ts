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
    const { orderId } = body;

    // 🔐 ENV
    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID");
    const CASHFREE_SECRET = Deno.env.get("CASHFREE_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!);

    // ✅ Fetch payment status from Cashfree
    const res = await fetch(
      `https://api.cashfree.com/pg/orders/${orderId}/payments`,
      {
        method: "GET",
        headers: {
          "x-client-id": CASHFREE_APP_ID!,
          "x-client-secret": CASHFREE_SECRET!,
          "x-api-version": "2022-09-01",
        },
      }
    );

    const payments = await res.json();

    console.log("Cashfree payments:", payments);

    // 🧠 Check if any payment is SUCCESS
    let paymentStatus = "PENDING";

    if (Array.isArray(payments)) {
      const paid = payments.find(
        (p) => p.payment_status === "SUCCESS"
      );

      if (paid) {
        paymentStatus = "PAID";
      } else {
        paymentStatus = "FAILED";
      }
    }

    // 📝 Insert new row (DO NOT UPDATE)
    await supabase.from("orders").insert([
      {
        order_id: orderId,
        status: paymentStatus,
      },
    ]);

    return new Response(
      JSON.stringify({
        success: paymentStatus === "PAID",
        status: paymentStatus,
      }),
      { headers: corsHeaders, status: 200 }
    );
  } catch (err) {
    console.error("verify-payment error:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      { headers: corsHeaders, status: 500 }
    );
  }
});