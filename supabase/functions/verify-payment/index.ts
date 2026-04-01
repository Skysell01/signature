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

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: "orderId is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const CASHFREE_APP_ID       = Deno.env.get("CASHFREE_APP_ID");
    const CASHFREE_SECRET       = Deno.env.get("CASHFREE_SECRET");
    const SUPABASE_URL          = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!);

    // Fetch payment status from Cashfree
    const res = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`,
      {
        method: "GET",
        headers: {
          "x-client-id":     CASHFREE_APP_ID!,
          "x-client-secret": CASHFREE_SECRET!,
          "x-api-version":   "2022-09-01",
        },
      }
    );

    // const payments = await res.json();
    // console.log("Cashfree payments:", payments);

    // // Determine final status
    // let paymentStatus = "FAILED";

    // if (Array.isArray(payments)) {
    //   const paid = payments.find((p) => p.payment_status === "SUCCESS");
    //   if (paid) {
    //     paymentStatus = "PAID";
    //   }
    // }
    const payments = await res.json();

let paymentStatus = "ABANDONED";

if (Array.isArray(payments)) {
  const paid = payments.find((p) => p.payment_status === "SUCCESS");

  if (paid) {
    paymentStatus = "PAID";
  }
}

    // UPDATE existing row — fixes the original INSERT bug
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: paymentStatus })
      .eq("order_id", orderId);

    if (updateError) {
      console.error("Supabase update error:", updateError.message);
      // Non-fatal — still return status to frontend
    }

    return new Response(
      JSON.stringify({
        success: paymentStatus === "PAID",
        status:  paymentStatus,
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    console.error("verify-payment error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});