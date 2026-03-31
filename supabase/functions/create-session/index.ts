// supabase/functions/create-session/index.ts
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
      amount,
      fullName,
      email,
      phoneNumber,
      profession,
      remarks,
      additionalProducts,
      couponCode,
      couponDiscount,
      url,
    } = body;

    // 🔐 ENV
    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID");
    const CASHFREE_SECRET = Deno.env.get("CASHFREE_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!);

    // 🆔 Unique order id
    const order_id = "order_" + Date.now();

    // 💳 Create Cashfree order
    const cfRes = await fetch("https://api.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID!,
        "x-client-secret": CASHFREE_SECRET!,
        "x-api-version": "2022-09-01",
      },
      body: JSON.stringify({
        order_id,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: phoneNumber || "guest_" + Date.now(),
          customer_name: fullName || "Guest",
          customer_email: email || "test@test.com",
          customer_phone: phoneNumber || "9999999999",
        },
        order_meta: {
          return_url: `${url}?order_id=${order_id}`,
        },
      }),
    });

    const cfData = await cfRes.json();

    if (!cfData.payment_session_id) {
      return new Response(
        JSON.stringify({ success: false, error: cfData }),
        { status: 400 , headers: corsHeaders}
      );
    }

    // 🧾 Insert PENDING row
    await supabase.from("orders").insert([
      {
        order_id,
        amount,
        status: "PENDING",
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        profession,
        remarks,
        additional_products: additionalProducts,
        coupon_code: couponCode,
        coupon_discount: couponDiscount,
      },
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          payment_session_id: cfData.payment_session_id,
          order_id,
        },
      }),
      {  headers: corsHeaders,status: 200 }
    );
  } catch (err) {
    console.error("create-session error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {  headers: corsHeaders,status: 500 }
    );
  }
});