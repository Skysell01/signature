import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      amount,
      fullName,
      email,
      phoneNumber,
      profession,
      remarks,
      additionalProducts,
      url,
    } = await req.json();

    // Validate required fields
    if (!amount || !fullName || !email || !phoneNumber) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const cashfreeResponse = await fetch(
      "https://api.cashfree.com/pg/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": Deno.env.get("CASHFREE_APP_ID")!,
          "x-client-secret": Deno.env.get("CASHFREE_SECRET_KEY")!,
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: amount,
          order_currency: "INR",
          customer_details: {
            customer_id: `cust_${Date.now()}`,
            customer_name: fullName,
            customer_email: email,
            customer_phone: phoneNumber,
          },
          order_meta: {
            return_url: url,
            notify_url: url,
          },
          order_note: `${profession || ''} - ${remarks || ''}`,
        }),
      }
    );

    const cashfreeData = await cashfreeResponse.json();
    console.log("Cashfree create order response:", JSON.stringify(cashfreeData));

    if (!cashfreeResponse.ok) {
      return new Response(
        JSON.stringify({ success: false, error: cashfreeData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          payment_session_id: cashfreeData.payment_session_id,
          order_id: cashfreeData.order_id,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("create-session error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});