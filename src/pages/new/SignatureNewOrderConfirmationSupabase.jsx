import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle, AlertCircle, Loader2, Signature,
} from "lucide-react";
import { toast } from "react-toastify";

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;

const Navbar = () => (
  <div className="flex items-center justify-center px-4 py-3 md:px-6 md:py-4 border-b border-amber-200">
    <div className="flex items-center space-x-3">
      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-2 rounded-xl">
        <Signature className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold text-gray-800">SignaturePro</span>
    </div>
  </div>
);

const SignatureNewOrderConfirmationSupabase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [orderStatus, setOrderStatus] = useState("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // ✅ Fix Bug 1 — read order_id (underscore) not orderId
  const orderId =
    searchParams.get("order_id") ||
    localStorage.getItem("pendingOrderId");

  const storedOrderData = localStorage.getItem("orderData")
    ? JSON.parse(localStorage.getItem("orderData"))
    : null;

  const amount = storedOrderData?.amount || 489;
  const { paymentMethod } = location.state || {};

  // ✅ Fix Bug 2 — retryCount in deps so retry actually re-verifies
  useEffect(() => {
    const verifyPayment = async () => {
      setOrderStatus("verifying");

      try {
        if (!orderId) {
          setOrderStatus("failed");
          setErrorMessage("Order ID not found. Please contact support.");
          return;
        }

        console.log("Verifying payment for:", orderId);

        const res = await fetch(`${FUNCTIONS_URL}/verify-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();
        console.log("Verify result:", data);

        if (data.status === "PAID") {
          setOrderStatus("success");
          toast.success("Payment successful 🎉");
          localStorage.removeItem("pendingOrderId");
        } else {
          setOrderStatus("failed");
          setErrorMessage("Payment was not completed. Please try again.");
          localStorage.removeItem("pendingOrderId");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setOrderStatus("failed");
        setErrorMessage("Could not verify payment. Please contact support.");
      }
    };

    verifyPayment();
  }, [retryCount]); // ✅ re-runs when retry is clicked

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  // ⏳ Verifying
  if (orderStatus === "verifying") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
        <p className="text-gray-600 text-lg">Verifying your payment...</p>
      </div>
    );
  }

  // ❌ Failed
  if (orderStatus === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
          <p className="text-gray-600">{errorMessage}</p>
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={handleRetry}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Retry Verification
            </button>
            <button
              onClick={() => navigate("/signature-new-cart-supabase")}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Success
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Navbar />

      <div className="max-w-3xl mx-auto text-center py-16 px-4 space-y-6">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />

        <h1 className="text-3xl font-bold text-gray-800">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600">
          Your order has been confirmed. You'll receive your signature design within 24–48 hours.
        </p>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium text-gray-800">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium text-gray-800">₹{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="font-medium text-gray-800">{paymentMethod || "Online"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-green-600">Paid ✓</span>
          </div>
        </div>

        <Link to="/signature-new">
          <button className="mt-4 px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SignatureNewOrderConfirmationSupabase;