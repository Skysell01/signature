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

    console.log("URL RECEIVED:", url);

    const CASHFREE_APP_ID       = Deno.env.get("CASHFREE_APP_ID");
    const CASHFREE_SECRET       = Deno.env.get("CASHFREE_SECRET");
    const SUPABASE_URL          = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!);

    const order_id = "order_" + Date.now();

    const safeUrl =
      url && url.startsWith("https")
        ? url
        : "https://designsignature.in/signature-new-order-confirmation";

    const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .replace("Z", "");

    // Create Cashfree order
    const cfRes = await fetch("https://api.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type":    "application/json",
        "x-client-id":     CASHFREE_APP_ID!,
        "x-client-secret": CASHFREE_SECRET!,
        "x-api-version":   "2022-09-01",
      },
      body: JSON.stringify({
        order_id,
        order_amount:   Number(amount),
        order_currency: "INR",
        customer_details: {
          customer_id:    phoneNumber || "guest_" + Date.now(),
          customer_name:  fullName    || "Guest",
          customer_email: email       || "test@test.com",
          customer_phone: phoneNumber || "9999999999",
        },
        order_meta: {
          return_url: `${safeUrl}?order_id=${order_id}`,
        },
      }),
    });

    const cfData = await cfRes.json();
    console.log("Cashfree response:", cfData);

    if (!cfData.payment_session_id) {
      return new Response(
        JSON.stringify({ success: false, error: cfData }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Insert PENDING row — column names match your DB exactly
    const { error: insertError } = await supabase.from("orders").insert([
      {
        order_id,
        amount,
        status:              "PENDING",
        full_name:           fullName    || null,
        email:               email       || null,
        phone_number:        phoneNumber || null,
        profession:          profession  || null,
        remarks:             remarks     || null,
        additional_products: additionalProducts || [],
        coupon_code:         couponCode  || null,
        coupon_discount:     couponDiscount || 0,
        created_at:          nowIST,
      },
    ]);

    if (insertError) {
      console.error("Supabase insert error:", insertError.message);
      // Non-fatal — still return session so user can pay
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          payment_session_id: cfData.payment_session_id,
          order_id,
        },
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    console.error("create-session error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});