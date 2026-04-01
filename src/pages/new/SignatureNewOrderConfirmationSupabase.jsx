import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  CheckCircle,
  Star,
  Sparkles,
  ArrowLeft,
  FileText,
  Signature,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;

const Navbar = () => {
  return (
    <div className="flex items-center justify-center px-4 py-3 md:px-6 md:py-4 border-b border-amber-200">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-2 rounded-xl">
          <Signature className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-800">
          SignaturePro
        </span>
      </div>
    </div>
  );
};

const SignatureNewOrderConfirmationSupabase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [orderStatus, setOrderStatus] = useState("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const orderId =
    searchParams.get("orderId") ||
    localStorage.getItem("pendingOrderId");

  const storedOrderData = localStorage.getItem("orderData")
    ? JSON.parse(localStorage.getItem("orderData"))
    : null;

  const amount = storedOrderData?.amount || 489;
  const { paymentMethod } = location.state || {};

  // 🔥 VERIFY PAYMENT ONLY (SUPABASE)
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!orderId) {
          setOrderStatus("failed");
          setErrorMessage("Invalid order ID");
          return;
        }

        console.log("🔍 Verifying payment:", orderId);

        const res = await fetch(
          `${FUNCTIONS_URL}/verify-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ orderId }),
          }
        );

        const data = await res.json();
        console.log("✅ VERIFY RESULT:", data);

        if (data.status === "PAID") {
          setOrderStatus("success");
          toast.success("Payment successful 🎉");

          localStorage.removeItem("pendingOrderId");
        } else {
          setOrderStatus("failed");
          setErrorMessage("Payment failed or cancelled ❌");

          localStorage.removeItem("pendingOrderId");
        }
      } catch (err) {
        console.error("❌ Verification error:", err);
        setOrderStatus("failed");
        setErrorMessage("Error verifying payment");
      }
    };

    verifyPayment();
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);
    window.location.reload();
  };

  // ⏳ LOADING
  if (orderStatus === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
      </div>
    );
  }

  // ❌ FAILED
  if (orderStatus === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">
            Payment Failed
          </h2>
          <p>{errorMessage}</p>

          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>

          <button
            onClick={() =>
              navigate("/signature-new-cart-supabase")
            }
            className="block mt-2"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  // ✅ SUCCESS UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <Navbar />

      <div className="max-w-3xl mx-auto text-center py-16 space-y-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />

        <h1 className="text-3xl font-bold">
          Payment Successful 🎉
        </h1>

        <p>Your order has been confirmed.</p>

        <div className="bg-white p-6 rounded-xl shadow">
          <p><b>Order ID:</b> {orderId}</p>
          <p><b>Amount:</b> ₹{amount}</p>
          <p><b>Payment:</b> {paymentMethod || "Online"}</p>
          <p className="text-green-600 font-semibold">
            Status: Paid
          </p>
        </div>

        <Link to="/signature-new">
          <button className="mt-4 px-6 py-2 bg-black text-white rounded">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SignatureNewOrderConfirmationSupabase;