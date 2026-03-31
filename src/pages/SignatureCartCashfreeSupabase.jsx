// src/pages/SignatureCartCashfreeSupabase.jsx

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import { toast } from "react-toastify";

import SignatureNavbar from "../components/signature/SignatureNavbar";
import SignatureTestimonialsSection from "../components/signature/SignatureTestimonialsSection";
import SignatureCartItem from "../components/signature/SignatureCartItem";
import SignatureConsultationForm from "../components/signature/SignatureConsultationForm";
import SignatureOrderSummary from "../components/signature/SignatureOrderSummary";
import SignatureAdditionalProducts from "../components/signature/SignatureAdditionalProducts";

// ─── ENV ─────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ─── EDGE FUNCTION CALLER ────────────────────────────

async function callEdgeFunction(functionName, body) {
  const res = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-session`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // 🔥 REQUIRED
      "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,

      // 🔥 REQUIRED (Supabase expects this)
      "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  }
);

  return await res.json();
}

// ─── STATIC DATA ─────────────────────────────────────

const INITIAL_CART_ITEMS = [
  {
    id: 1,
    name: "✍ Professional Signature Design",
    description:
      "Personalized professional signature design based on your name and personality",
    price: 2,
    originalPrice: 4999,
    duration: "24-48 hours",
    features: [
      "Your Professional Signature Design",
      "Multiple Style Variations",
      "Digital & Print Ready Formats",
      "Lifetime Usage Rights",
    ],
    image: "/astro-hero.jpeg",
  },
];

const ADDITIONAL_PRODUCTS = [
  {
    id: 2,
    title: "✍️ Want to master your new signature perfectly?",
    description:
      "Add a printable sheet with your signature traced & outlined.",
    features: [
      "Light grey version for trace-over",
      "Lined version for practice",
      "Premium feel",
    ],
    price: 199,
    originalPrice: 499,
  },
];

const COUPONS = { rag30: 30, rag60: 60, rag75: 75 };

// ─── COMPONENT ───────────────────────────────────────

function SignatureCartCashfreeSupabase() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  const [sdkInitialized, setSdkInitialized] = useState(false);

  const [consultationFormData, setConsultationFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    profession: "",
    remarks: "",
  });

  const [couponCode, setCouponCode] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // ─── INIT ──────────────────────────────────────────

  useEffect(() => {
    window.scrollTo({ top: 0 });

    const rawQuery = new URLSearchParams(window.location.search).toString();
    for (const [code, pct] of Object.entries(COUPONS)) {
      if (rawQuery.includes(code)) {
        setCouponCode(code);
        setCouponDiscount(pct);
        break;
      }
    }

    initCashfreeSDK();
  }, []);

  const initCashfreeSDK = async () => {
    try {
      const instance = await load({ mode: "production" });
      setCashfree(instance);
      setSdkInitialized(true);
    } catch (err) {
      toast.error("Payment system failed to load");
    }
  };

  // ─── HELPERS ───────────────────────────────────────

  const onProductToggle = (id) =>
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectedAddons = ADDITIONAL_PRODUCTS.filter((p) =>
    selectedProducts.includes(p.id)
  );

  const subtotal =
    cartItems.reduce((s, i) => s + i.price, 0) +
    selectedAddons.reduce((s, p) => s + p.price, 0);

  const couponDiscountAmount =
    couponDiscount > 0 ? Math.floor((subtotal * couponDiscount) / 100) : 0;

  const total = subtotal - couponDiscountAmount;

  const orderPayload = () => ({
    amount: total,
    fullName: consultationFormData.name || null,
    email: consultationFormData.email || null,
    phoneNumber: consultationFormData.phoneNumber || null,
    profession: consultationFormData.profession || null,
    remarks: consultationFormData.remarks || null,
    additionalProducts: selectedAddons.map((p) => p.title),
    couponCode,
    couponDiscount: couponDiscountAmount,
  });

  // ─── PAYMENT FLOW ──────────────────────────────────

  const doPayment = async () => {
    if (!sdkInitialized || !cashfree) {
      toast.error("Payment not ready");
      return;
    }

    if (!consultationFormData.phoneNumber) {
      toast.error("Enter phone number");
      return;
    }

    if (creatingSession || isCheckingOut) return;

    setIsCheckingOut(true);

    try {
      setCreatingSession(true);

      // STEP 1: CREATE SESSION
      const sessionRes = await callEdgeFunction("create-session", {
        ...orderPayload(),
         url: `${window.location.origin}/signature-order-confirmation-cashfree`,
      });

      setCreatingSession(false);

      if (!sessionRes.success) {
        toast.error("Session failed");
        return;
      }

      const { payment_session_id, order_id } = sessionRes.data;

      // STEP 2: OPEN CASHFREE
      const modalResult = await cashfree.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal",
      });

      console.log("CF Result:", modalResult);

      // ❌ CANCEL / FAIL
      if (modalResult?.error) {
        await callEdgeFunction("verify-payment", {
          orderId: order_id,
          statusOverride: "ABANDONED",
          ...orderPayload(),
        });

        toast.error("Payment cancelled");
        return;
      }

      // ⚠️ REDIRECT CASE
      if (modalResult?.redirect) return;

      // ✅ SUCCESS
      const verifyRes = await callEdgeFunction("verify-payment", {
        orderId: order_id,
        ...orderPayload(),
      });

      if (!verifyRes.success) {
        toast.error("Verification failed");
        return;
      }

      toast.success("Payment Successful 🎉");

      navigate("/signature-order-confirmation-cashfree", {
        state: {
          orderId: order_id,
          amount: total,
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Payment error");
    } finally {
      setIsCheckingOut(false);
      setCreatingSession(false);
    }
  };

  // ─── UI ────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      <SignatureNavbar />

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-center">Your Cart</h1>

        {cartItems.map((item) => (
          <SignatureCartItem key={item.id} item={item} />
        ))}

        <SignatureAdditionalProducts
          products={ADDITIONAL_PRODUCTS}
          selectedProducts={selectedProducts}
          onProductToggle={onProductToggle}
        />

        <SignatureConsultationForm
          formData={consultationFormData}
          setFormData={setConsultationFormData}
        />

       <SignatureOrderSummary
  subtotal={subtotal}
  discount={0}
  totalMrp={subtotal}
  discountMrp={0}
  total={total}
  couponCode={couponCode}
  couponDiscount={couponDiscount}
  couponDiscountAmount={couponDiscountAmount}
  isCheckingOut={isCheckingOut}
  onCheckout={doPayment}
/>
      </div>

      <SignatureTestimonialsSection />
    </div>
  );
}

export default SignatureCartCashfreeSupabase;