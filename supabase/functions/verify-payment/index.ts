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
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: "orderId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch real payment status from Cashfree
    const cashfreeResponse = await fetch(
      `https://api.cashfree.com/pg/orders/${orderId}/payments`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": Deno.env.get("CASHFREE_APP_ID")!,
          "x-client-secret": Deno.env.get("CASHFREE_SECRET_KEY")!,
        },
      }
    );

    const payments = await cashfreeResponse.json();
    console.log("Cashfree verify response:", JSON.stringify(payments));

    if (!cashfreeResponse.ok) {
      return new Response(
        JSON.stringify({ success: false, error: payments }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // payments is an array — find successful one
    const successfulPayment = Array.isArray(payments)
      ? payments.find((p) => p.payment_status === "SUCCESS")
      : null;

    const isSuccess = !!successfulPayment;

    // Get real status from Cashfree
    const paymentStatus = successfulPayment?.payment_status
      || (Array.isArray(payments) && payments[0]?.payment_status)
      || "PENDING";

    return new Response(
      JSON.stringify({
        success: isSuccess,
        paymentStatus,                              // SUCCESS / FAILED / PENDING / CANCELLED
        paymentDetails: successfulPayment
          || (Array.isArray(payments) ? payments[0] : null)
          || null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("verify-payment error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});