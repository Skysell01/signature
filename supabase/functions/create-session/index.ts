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
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON body" }),
        { status: 400, headers: corsHeaders }
      );
    }

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

    if (!amount) {
      return new Response(
        JSON.stringify({ success: false, error: "Amount is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const CASHFREE_APP_ID       = Deno.env.get("CASHFREE_APP_ID");
    const CASHFREE_SECRET       = Deno.env.get("CASHFREE_SECRET");
    const CASHFREE_MODE         = Deno.env.get("CASHFREE_MODE") || "production";
    const SUPABASE_URL          = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!);

    // Switch Cashfree base URL based on mode
    const CF_BASE_URL = CASHFREE_MODE === "sandbox"
      ? "https://sandbox.cashfree.com"
      : "https://api.cashfree.com";

    const order_id = "order_" + Date.now();

    // Safe return URL — use what frontend sends, fallback to confirmation page
    const safeUrl =
      url && url.startsWith("https")
        ? url
        : "https://designsignature.in/signature-new-order-confirmation-supabase";

    const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .replace("Z", "");

    // Create Cashfree order
    const cfRes = await fetch(`${CF_BASE_URL}/pg/orders`, {
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

    let cfData: any = {};
    try {
      cfData = await cfRes.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Cashfree returned empty response" }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log("Cashfree response:", cfData);

    if (!cfData.payment_session_id) {
      return new Response(
        JSON.stringify({ success: false, error: "No payment_session_id", details: cfData }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Insert PENDING row
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
      console.error("DB Insert Error:", insertError.message);
      // Non-fatal — still return session
    }

    // ✅ Wrap inside data{} so cart can read data.data.payment_session_id
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

  } catch (err: any) {
    console.error("create-session error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Something went wrong" }),
      { status: 500, headers: corsHeaders }
    );
  }
});