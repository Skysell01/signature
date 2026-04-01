import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import Navbar from "../signature-new/Navbar";
import Testimonial from "../signature-new/Testimonial";
import CartItem from "./CartItem";
import SignatureCartConsultationForm from "./SignatureCartConsultationForm";
import { load } from "@cashfreepayments/cashfree-js";
import { toast } from "react-toastify";
import axios from "axios";

function SignatureNewCartSupabase() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cashfree, setCashfree] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Coupon logic
  const urlParams = new URLSearchParams(location.search);
  const ragCoupon =
    urlParams.get("rag30") || urlParams.get("rag60") || urlParams.get("rag75");

  const getCouponDiscount = (coupon) => {
    if (coupon === "rag30") return 30;
    if (coupon === "rag60") return 60;
    if (coupon === "rag75") return 75;
    return 0;
  };

  const couponDiscountPercentage = getCouponDiscount(ragCoupon);

  const [cartItems] = useState([
    {
      id: 1,
      name: "✍ Professional Signature Design",
      price: 489,
      originalPrice: 4999,
    },
  ]);

  const [consultationFormData, setConsultationFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    profession: "",
    remarks: "",
  });

  useEffect(() => {
    initCashfree();
  }, []);

  const initCashfree = async () => {
    try {
      const cf = await load({ mode: "production" });
      setCashfree(cf);
    } catch (err) {
      toast.error("Cashfree init failed");
    }
  };

  // Price calculation
  const subtotal = cartItems.reduce((sum, i) => sum + i.price, 0);
  const couponDiscount =
    (subtotal * couponDiscountPercentage) / 100;

  const total = subtotal - couponDiscount;

  // 🔥 IMPORTANT: This will be replaced by Supabase Edge Function
  const createPaymentSession = async () => {
    try {
      const { data } = await axios.post("/api/create-cashfree-session", {
        amount: total,
        customer: consultationFormData,
      });

      return data.payment_session_id;
    } catch (err) {
      toast.error("Payment session failed");
      return null;
    }
  };

  const doPayment = async () => {
    if (!cashfree) {
      toast.error("Payment not ready");
      return;
    }

    setIsCheckingOut(true);

    const sessionId = await createPaymentSession();

    if (!sessionId) {
      setIsCheckingOut(false);
      return;
    }

    cashfree.checkout({
      paymentSessionId: sessionId,
      redirectTarget: "_self",
      onSuccess: (data) => {
        navigate("/success", {
          state: { orderId: data.orderId, amount: total },
        });
      },
      onFailure: () => {
        toast.error("Payment failed");
      },
    });

    setIsCheckingOut(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Cart</h1>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}

        {/* Form */}
        <SignatureCartConsultationForm
          formData={consultationFormData}
          setFormData={setConsultationFormData}
        />

        {/* Summary */}
        <div className="mt-6 p-4 border rounded-lg">
          <p>Subtotal: ₹{subtotal}</p>
          {couponDiscount > 0 && (
            <p className="text-green-600">
              Coupon Discount: -₹{couponDiscount}
            </p>
          )}
          <h2 className="text-xl font-bold">Total: ₹{total}</h2>

          <button
            onClick={doPayment}
            disabled={isCheckingOut}
            className="mt-4 w-full bg-yellow-500 text-white py-2 rounded"
          >
            {isCheckingOut ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>

      <Testimonial />
    </div>
  );
}

export default SignatureNewCartSupabase;