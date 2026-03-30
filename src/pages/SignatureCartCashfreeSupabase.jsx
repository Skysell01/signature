import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import React, { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { toast } from "react-toastify";

import SignatureNavbar from "../components/signature/SignatureNavbar";
import SignatureCartItem from "../components/signature/SignatureCartItem";
import SignatureConsultationForm from "../components/signature/SignatureConsultationForm";
import SignatureOrderSummary from "../components/signature/SignatureOrderSummary";
import SignatureAdditionalProducts from "../components/signature/SignatureAdditionalProducts";

function SignatureCartCashfreeSupabase() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cashfree, setCashfree] = useState(null);
  const [loading, setLoading] = useState(false);

  const [cartItems] = useState([
    {
      id: 1,
      name: "Signature Design",
      price: 2,
      originalPrice: 4999,
    },
  ]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [consultationFormData, setConsultationFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profession: "",
    remarks: "",
  });

  const additionalProducts = [
    {
      id: 2,
      title: "Practice Sheet",
      price: 199,
      originalPrice: 499,
    },
  ];

  // ✅ Init Cashfree
  useEffect(() => {
    const init = async () => {
      const cf = await load({ mode: "production" });
      setCashfree(cf);
    };
    init();
  }, []);

  // ✅ Totals
  const selectedAdditional = additionalProducts.filter((p) =>
    selectedProducts.includes(p.id)
  );

  const subtotal =
    cartItems.reduce((sum, i) => sum + i.price, 0) +
    selectedAdditional.reduce((sum, p) => sum + p.price, 0);

  const total = subtotal;

  // ✅ Create Order + Save Abandoned
  const createOrder = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-session",
        {
          body: {
            amount: total,
            name: consultationFormData.name,
            email: consultationFormData.email,
            phone: consultationFormData.phoneNumber,
          },
        }
      );

      if (error) throw error;

      const { payment_session_id, order_id } = data.data;

      // 🔥 Save abandoned first
      await supabase.from("orders").insert([
        {
          amount: total,
          full_name: consultationFormData.name,
          email: consultationFormData.email,
          phone_number: consultationFormData.phoneNumber,
          payment_status: "abandoned",
          cashfree_order_id: order_id,
        },
      ]);

      localStorage.setItem("orderId", order_id);

      return payment_session_id;
    } catch (err) {
      console.error(err);
      toast.error("Session failed");
      return null;
    }
  };

  // ✅ Payment Flow
  const handlePayment = async () => {
    if (!cashfree) return toast.error("Payment not ready");

    setLoading(true);

    try {
      const sessionId = await createOrder();
      if (!sessionId) return;

      // 🔥 Open Cashfree modal
      await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      });

      const orderId = localStorage.getItem("orderId");

      // 🔍 Verify payment from edge function
      const { data } = await supabase.functions.invoke("verify-payment", {
        body: { orderId },
      });

      if (!data?.success) {
        toast.error("Payment failed or cancelled");
        return;
      }

      // ✅ Update status to PAID
      await supabase
        .from("orders")
        .update({ payment_status: "paid" })
        .eq("cashfree_order_id", orderId);

      toast.success("Payment Successful 🎉");

      navigate("/signature-order-confirmation-cashfree", {
        state: { orderId, amount: total },
      });
    } catch (err) {
      console.error(err);
      toast.error("Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SignatureNavbar />

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {cartItems.map((item) => (
          <SignatureCartItem key={item.id} item={item} />
        ))}

        <SignatureAdditionalProducts
          products={additionalProducts}
          selectedProducts={selectedProducts}
          onProductToggle={(id) =>
            setSelectedProducts((prev) =>
              prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
            )
          }
        />

        <SignatureConsultationForm
          formData={consultationFormData}
          setFormData={setConsultationFormData}
        />

        <SignatureOrderSummary
          total={total}
          isCheckingOut={loading}
          onCheckout={handlePayment}
        />
      </div>
    </div>
  );
}

export default SignatureCartCashfreeSupabase;