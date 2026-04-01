import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import Navbar from "../signature-new/Navbar";
import Testimonial from "../signature-new/Testimonial";
import CartItem from "./CartItem";
import SignatureCartConsultationForm from "./SignatureCartConsultationForm";
import { load } from "@cashfreepayments/cashfree-js";
import { toast } from "react-toastify";

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTION_URL;

function SignatureNewCartSupabase() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cashfree, setCashfree]           = useState(null);
  const [sdkReady, setSdkReady]           = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // ── Coupon from URL ──────────────────────────────────────────────────────────
  const urlParams = new URLSearchParams(location.search);
  const ragCoupon =
    urlParams.get("rag30") !== null ? "rag30" :
    urlParams.get("rag60") !== null ? "rag60" :
    urlParams.get("rag75") !== null ? "rag75" : null;

  const getCouponDiscount = (coupon) => {
    if (coupon === "rag30") return 30;
    if (coupon === "rag60") return 60;
    if (coupon === "rag75") return 75;
    return 0;
  };

  const couponDiscountPercentage = getCouponDiscount(ragCoupon);

  // ── Cart items ───────────────────────────────────────────────────────────────
  const [cartItems] = useState([
    {
      id: 1,
      name: "✍ Professional Signature Design",
      description: "Personalized professional signature design based on your name and personality",
      price: 1,
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
  ]);

  // ── Additional products ──────────────────────────────────────────────────────
  const additionalProducts = [
    {
      id: 2,
      title: "✍️ Want to master your new signature perfectly?",
      description:
        "Add a printable sheet with your signature traced & outlined — just like handwriting practice sheets.",
      features: [
        "Light grey version for trace-over",
        "Lined version for repeat practice",
        "Adds premium feel for very little effort",
      ],
      price: 199,
      originalPrice: 499,
    },
  ];

  // ── Form data ────────────────────────────────────────────────────────────────
  const [consultationFormData, setConsultationFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    profession: "",
    remarks: "",
  });

  // ── Init ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setAnimateElements(true), 100);
    initCashfree();
  }, []);

  const initCashfree = async () => {
    try {
      const cf = await load({
        mode: import.meta.env.VITE_CASHFREE_MODE || "production",
      });
      setCashfree(cf);
      setSdkReady(true);
    } catch (err) {
      console.error("Cashfree init failed:", err);
      toast.error("Payment system failed to load. Please refresh.");
    }
  };

  // ── Price calculation ────────────────────────────────────────────────────────
  const selectedAdditionalProducts = additionalProducts.filter((p) =>
    selectedProducts.includes(p.id)
  );

  const cartSubtotal        = cartItems.reduce((sum, i) => sum + i.price, 0);
  const additionalSubtotal  = selectedAdditionalProducts.reduce((sum, p) => sum + p.price, 0);
  const subtotal            = cartSubtotal + additionalSubtotal;

  const cartMrp             = cartItems.reduce((sum, i) => sum + i.originalPrice, 0);
  const additionalMrp       = selectedAdditionalProducts.reduce((sum, p) => sum + p.originalPrice, 0);
  const totalMrp            = cartMrp + additionalMrp;

  const discountMrp         = totalMrp - subtotal;
  const couponDiscount      = couponDiscountPercentage > 0
    ? Math.round((subtotal * couponDiscountPercentage) / 100)
    : 0;
  const total               = subtotal - couponDiscount;

  const onProductToggle = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // ── Create payment session via Supabase edge function ────────────────────────
  const createPaymentSession = async () => {
    if (creatingSession) {
      toast.error("Already creating a session. Please wait.");
      return null;
    }

    try {
      setCreatingSession(true);

      const payload = {
        amount:             total,
        fullName:           consultationFormData.name,
        email:              consultationFormData.email,
        phoneNumber:        consultationFormData.phoneNumber,
        profession:         consultationFormData.profession,
        remarks:            consultationFormData.remarks,
        additionalProducts: selectedAdditionalProducts.map((p) => p.title),
        couponCode:         ragCoupon,
        couponDiscount:     couponDiscount,
        url: `${window.location.origin}/signature-new-order-confirmation`,
      };

      // Save to localStorage so confirmation page can read it
      localStorage.setItem("orderData", JSON.stringify({
        ...payload,
        originalAmount: subtotal,
      }));

      const res = await fetch(`${FUNCTIONS_URL}/create-session`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success || !data.data?.payment_session_id) {
        toast.error("Failed to create payment session. Please try again.");
        return null;
      }

      // Save order_id so confirmation page can verify payment
      localStorage.setItem("pendingOrderId", data.data.order_id);

      return data.data.payment_session_id;

    } catch (err) {
      console.error("create-session error:", err);
      toast.error("Failed to create payment session. Please try again.");
      return null;
    } finally {
      setCreatingSession(false);
    }
  };

  // ── Trigger payment ──────────────────────────────────────────────────────────
  const doPayment = async () => {
    if (!sdkReady || !cashfree) {
      toast.error("Payment system is not ready. Please try again.");
      return;
    }

    if (!consultationFormData.name || !consultationFormData.phoneNumber || !consultationFormData.email) {
      toast.error("Please fill in your name, phone, and email before paying.");
      return;
    }

    setIsCheckingOut(true);

    const paymentSessionId = await createPaymentSession();

    if (!paymentSessionId) {
      setIsCheckingOut(false);
      return;
    }

    try {
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
        onSuccess: (data) => {
          localStorage.setItem("orderData", JSON.stringify({
            amount:             total,
            fullName:           consultationFormData.name,
            email:              consultationFormData.email,
            phoneNumber:        consultationFormData.phoneNumber,
            profession:         consultationFormData.profession,
            remarks:            consultationFormData.remarks,
            additionalProducts: selectedAdditionalProducts.map((p) => p.title),
            couponCode:         ragCoupon,
            couponDiscount,
            originalAmount:     subtotal,
          }));
          navigate("/signature-new-order-confirmation", {
            state: { orderId: data.orderId, amount: total },
          });
        },
        onFailure: () => {
          toast.error("Payment failed. Please try again.");
        },
      });
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("An error occurred during payment. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // ── Additional Products component ────────────────────────────────────────────
  const AdditionalProducts = ({ products, selectedProducts, onProductToggle }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Add-On Services</h3>
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedProducts.includes(product.id)
                ? "border-yellow-400 bg-yellow-50"
                : "border-gray-200 hover:border-yellow-300"
            }`}
            onClick={() => onProductToggle(product.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  id={`add-${product.id}`}
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) => { e.stopPropagation(); onProductToggle(product.id); }}
                  className="sr-only"
                />
                <label
                  htmlFor={`add-${product.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className={`relative flex items-center justify-center w-6 h-6 rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                    selectedProducts.includes(product.id)
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 border-amber-600 shadow-lg"
                      : "bg-white border-gray-300 hover:border-amber-500"
                  }`}
                >
                  {selectedProducts.includes(product.id) && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </label>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{product.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                <div className="space-y-1">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                  <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Order Summary component ──────────────────────────────────────────────────
  const OrderSummary = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal (MRP)</span>
          <span className="text-gray-600 font-medium">₹{totalMrp}</span>
        </div>
        {discountMrp > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discountMrp}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
            <span className="font-semibold">
              {ragCoupon?.toUpperCase()} ({couponDiscountPercentage}% OFF)
            </span>
            <span className="font-bold">-₹{couponDiscount}</span>
          </div>
        )}
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-800">Total</span>
            <span className="text-gray-800">₹{total}</span>
          </div>
        </div>
      </div>
      <button
        onClick={doPayment}
        disabled={isCheckingOut || creatingSession}
        className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 disabled:opacity-50"
      >
        {isCheckingOut || creatingSession
          ? "Processing..."
          : `Proceed to Payment — ₹${total}`}
      </button>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 relative isolate">
      <div className="sticky top-0 z-[100]">
        <Navbar />
      </div>

      <section className="relative pt-8 pb-16 z-[1]">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <div className={`text-center mb-8 transition-all duration-1000 transform ${
            animateElements ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Your Signature Cart
              </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Review your selected signature design and prepare for your professional journey
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center space-y-6">
              <div className="text-6xl animate-bounce">✍️</div>
              <h3 className="text-2xl font-bold text-gray-800">Your Signature Cart is Empty</h3>
              <p className="text-gray-600">Ready to create your professional signature?</p>
              <Link
                to="/signature"
                className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all duration-300"
              >
                Explore Signature Services
              </Link>
            </div>
          ) : (
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-500 transform ${
              animateElements ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}>

              {/* Left column */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} showRemoveButton={false} />
                ))}
                <AdditionalProducts
                  products={additionalProducts}
                  selectedProducts={selectedProducts}
                  onProductToggle={onProductToggle}
                />
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <SignatureCartConsultationForm
                  formData={consultationFormData}
                  setFormData={setConsultationFormData}
                />
                <OrderSummary />
              </div>

            </div>
          )}
        </div>
      </section>

      <Testimonial />
    </div>
  );
}

export default SignatureNewCartSupabase;