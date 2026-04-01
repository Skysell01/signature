import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  X,
  Shield,
  Sparkles,
  Check,
  Star,
  Palette,
  Briefcase,
  Search,
  DollarSign,
} from "lucide-react";
import Navbar from "../signature-new/Navbar";
import Testimonial from "../signature-new/Testimonial";
import Footer from "../signature-new/Footer";
import CartItem from "./CartItem";
import SignatureCartConsultationForm from "./SignatureCartConsultationForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/backendUrl";
import { load } from "@cashfreepayments/cashfree-js";
import { toast } from "react-toastify";

function SignatureNewCartCashFree() {
  const navigate = useNavigate();
  const location = useLocation();
  const [creatingSession, setCreatingSession] = useState(false);
  
  // Parse RAG coupon from URL parameters
  const urlParams = new URLSearchParams(location.search);
  const ragCoupon = urlParams.get('rag30') !== null ? 'rag30' : 
                   urlParams.get('rag60') !== null ? 'rag60' : 
                   urlParams.get('rag75') !== null ? 'rag75' : null;
  
  // Get discount percentage based on coupon
  const getCouponDiscount = (coupon) => {
    switch(coupon) {
      case 'rag30': return 30;
      case 'rag60': return 60;
      case 'rag75': return 75;
      default: return 0;
    }
  };
  
  const couponDiscountPercentage = getCouponDiscount(ragCoupon);
  const [cartItems, setCartItems] = useState([
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
  ]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [consultationFormData, setConsultationFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    profession: "",
    remarks: "",
  });

  // Additional products data
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
      icon: "✍️",
      color: {
        from: "from-yellow-500/20",
        via: "via-amber-500/20",
        to: "to-yellow-500/20",
      },
    },
  ];

  useEffect(() => {
    // Scroll to top when component mounts or when navigating from other pages
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    // Check if we're coming from a CTA button (with scrollToTop state)
    if (location.state?.scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }

    const timer = setTimeout(() => {
      setAnimateElements(true);
    }, 100);

    // Initialize Cashfree SDK
    initializeSDK();

    return () => {
      clearTimeout(timer);
    };
  }, [location.state]);

    useEffect(() => {
    const logPath = async () => {
      try {
        const indianTime = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        await fetch(`${BACKEND_URL}/api/log/log-path`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: "cart",
            timestamp: indianTime,
          }),
        });
      } catch (error) {
        console.error("Error logging path:", error);
      }
    };

    logPath();
  }, []);

  // Initialize Cashfree SDK
  const initializeSDK = async () => {
    try {
      const cashfreeInstance = await load({
        // mode: "sandbox", // Change to "production" for live environment
        mode: "production",
      });
      setCashfree(cashfreeInstance);
      setSdkInitialized(true);
      console.log("Cashfree SDK initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Cashfree SDK:", error);
      toast.error("Failed to initialize payment system");
      setSdkInitialized(false);
    }
  };

  const onProductToggle = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleConsultationFormSubmit = (formData) => {
    setConsultationFormData(formData);
    console.log("Consultation form submitted:", formData);
  };

  const removeItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Calculate cart totals including selected additional products
  const selectedAdditionalProducts = additionalProducts.filter((product) =>
    selectedProducts.includes(product.id)
  );

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const cartTotalMrp = cartItems.reduce(
    (sum, item) => sum + item.originalPrice * (item.quantity || 1),
    0
  );
  const additionalSubtotal = selectedAdditionalProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );
  const additionalTotalMrp = selectedAdditionalProducts.reduce(
    (sum, product) => sum + product.originalPrice,
    0
  );
  const totalMrp = cartTotalMrp + additionalTotalMrp;
  const subtotal = cartSubtotal + additionalSubtotal;

  const cartDiscount = cartItems.reduce(
    (sum, item) =>
      sum + (item.originalPrice - item.price) * (item.quantity || 1),
    0
  );
  const additionalDiscount = selectedAdditionalProducts.reduce(
    (sum, product) => sum + (product.originalPrice - product.price),
    0
  );
  const cartDiscountMrp = cartItems.reduce(
    (sum, item) =>
      sum + (item.originalPrice - item.price) * (item.quantity || 1),
    0
  );
  const additionalDiscountMrp = selectedAdditionalProducts.reduce(
    (sum, product) => sum + (product.originalPrice - product.price),
    0
  );
  const discountMrp = cartDiscountMrp + additionalDiscountMrp;
  const discount = cartDiscount + additionalDiscount;

  // Calculate RAG coupon discount
  const couponDiscount = couponDiscountPercentage > 0 ? Math.round((subtotal * couponDiscountPercentage) / 100) : 0;
  
  // Final total after applying coupon discount
  const total = subtotal - couponDiscount;
  
  // Debug logging for coupon functionality
  console.log('RAG Coupon Debug:', {
    ragCoupon,
    couponDiscountPercentage,
    subtotal,
    couponDiscount,
    total,
    selectedAdditionalProducts: selectedAdditionalProducts.length
  });
  // Create Payment Session
  const createPaymentSession = async () => {
    if (creatingSession) {
      toast.error("Payment session is already being created. Please wait.");
      return null;
    }

    try {
      setCreatingSession(true);

      // Create abandoned cart first
      const abandonedCartRes = await axios.post(
        `${BACKEND_URL}/api/signature/rag/create-order-abd`,
        {
          amount: total,
          // amount: 2,
          fullName: consultationFormData?.name,
          email: consultationFormData?.email,
          phoneNumber: consultationFormData?.phoneNumber,
          profession: consultationFormData?.profession,
          remarks: consultationFormData?.remarks,
          additionalProducts: selectedAdditionalProducts.map(
            (product) => product.title
          ),
          couponCode: ragCoupon,
          couponDiscount: couponDiscount,
          originalAmount: subtotal,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      const abandonedCartID = abandonedCartRes.data.data._id;

      // Storing to localstorage
      localStorage.setItem("abandonedCartID", abandonedCartID);

      // Storing to localstorage
      localStorage.setItem(
        "orderData",
        JSON.stringify({
          // amount: 2,
          amount: total,
          fullName: consultationFormData?.name,
          email: consultationFormData?.email,
          phoneNumber: consultationFormData?.phoneNumber,
          profession: consultationFormData?.profession,
          remarks: consultationFormData?.remarks,
          additionalProducts: selectedAdditionalProducts.map(
            (product) => product.title
          ),
          couponCode: ragCoupon,
          couponDiscount: couponDiscount,
          originalAmount: subtotal,
        })
      );

      // Create payment session
      const apiResponse = await axios.post(
        `${BACKEND_URL}/api/payment/create-session`,
        {
          amount: total,
          // amount: 2,
          fullName: consultationFormData?.name,
          email: consultationFormData?.email,
          phoneNumber: consultationFormData?.phoneNumber,
          profession: consultationFormData?.profession,
          remarks: consultationFormData?.remarks,
          additionalProducts: selectedAdditionalProducts.map(
            (product) => product.title
          ),
          couponCode: ragCoupon,
          couponDiscount: couponDiscount,
          originalAmount: subtotal,
          orderType: "normal",
          quantity: 1,
          url: `${window.location.origin}/signature-new-order-confirmation`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      console.log("Payment session created:", apiResponse);
      return apiResponse?.data?.data?.payment_session_id;
    } catch (error) {
      console.error("Error creating payment session:", error);
      toast.error("Failed to create payment session. Please try again.");
      return null;
    } finally {
      setCreatingSession(false);
    }
  };

 const trackLinkedIn = (conversionId) => {
  console.log("aaaaa")
  try {
    if (typeof window === "undefined") return;

    // If lintrk is available, fire immediately
    if (typeof window.lintrk === "function") {
      window.lintrk("track", { conversion_id: conversionId });
      return;
    }

    // If LinkedIn script hasn't loaded yet, queue it (this matches how LinkedIn sets lintrk.q)
    window.lintrk = window.lintrk || function (...args) {
      window.lintrk.q = window.lintrk.q || [];
      window.lintrk.q.push(args);
    };
    window.lintrk.q = window.lintrk.q || [];
    window.lintrk("track", { conversion_id: conversionId });
  } catch (e) {
    // silently ignore tracking errors
    console.warn("LinkedIn tracking failed:", e);
  }
};

const doPayment = async () => {
  // ✅ Track "checkout click" (user intent)
  trackLinkedIn(23367916);

  // Check if SDK is initialized
  if (!sdkInitialized || !cashfree) {
    toast.error("Payment system is not ready. Please try again in a moment.");
    return;
  }

  setIsCheckingOut(true);

  const paymentSessionId = await createPaymentSession();
  console.log("paymentsessionid", paymentSessionId);

  if (!paymentSessionId) {
    setIsCheckingOut(false);
    return;
  }

  try {
    const checkoutOptions = {
      paymentSessionId,
      redirectTarget: "_self",
      onSuccess: function (data) {
        console.log("Payment successful:", data);

        // ✅ Track "payment success" too (stronger conversion signal)
        trackLinkedIn(23367916);

        localStorage.setItem(
          "orderData",
          JSON.stringify({
            amount: total,
            fullName: consultationFormData?.name,
            email: consultationFormData?.email,
            phoneNumber: consultationFormData?.phoneNumber,
            profession: consultationFormData?.profession,
            remarks: consultationFormData?.remarks,
            additionalProducts: selectedAdditionalProducts.map(
              (product) => product.title
            ),
            couponCode: ragCoupon,
            couponDiscount,
            originalAmount: subtotal,
          })
        );

        navigate("/signature-new-order-confirmation", {
          state: {
            orderId: data.orderId,
            amount: total,
            paymentMethod: "Cashfree",
          },
        });
      },
      onFailure: function (data) {
        console.log("Payment failed:", data);
        toast.error("Payment failed. Please try again.");
      },
    };

    cashfree.checkout(checkoutOptions);
  } catch (error) {
    console.error("Error during payment:", error);
    toast.error("An error occurred during payment. Please try again.");
  } finally {
    setIsCheckingOut(false);
  }
};


  // Additional Products Component
  const AdditionalProducts = ({
    products,
    selectedProducts,
    onProductToggle,
  }) => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Add-On Services
        </h3>
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
                {/* Tick checkbox like SignatureAdditionalProducts */}
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    id={`add-${product.id}`}
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onProductToggle(product.id);
                    }}
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
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </label>
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {product.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {product.description}
                  </p>
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
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Order Summary Component
  const OrderSummary = ({
    discount,
    total,
    isCheckingOut,
    onCheckout,
    totalMrp,
    discountMrp,
    couponDiscount,
    couponDiscountPercentage,
    ragCoupon,
  }) => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-600 font-medium">₹{totalMrp}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="">Discount</span>
              <span>-₹{discountMrp}</span>
            </div>
          )}
          {couponDiscount > 0 && (
            <div className="flex justify-between text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
              <span className="font-semibold">
                {ragCoupon?.toUpperCase()} Coupon ({couponDiscountPercentage}% OFF)
              </span>
              <span className="font-bold">-₹{couponDiscount}</span>
            </div>
          )}
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-600">Total</span>
              <span className="text-gray-600">₹{total}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onCheckout}
          disabled={isCheckingOut}
          className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 disabled:opacity-50"
        >
          {isCheckingOut ? "Processing..." : `Proceed to Payment - ₹${total}`}
        </button>
      </div>
    );
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 relative isolate">
      {/* Navigation */}
      <div className="sticky top-0 z-[100]">
        <Navbar />
      </div>

      {/* Cart Content */}
     <section className="relative pt-8 pb-16 z-[1]">
         <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div
            className={`text-center mb-8 transition-all duration-1000 transform ${
              animateElements
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Your Signature Cart
              </span>
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Review your selected signature design and prepare for your
              professional journey
            </p>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div
              className={`max-w-2xl mx-auto transition-all duration-1000 delay-300 transform ${
                animateElements
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-8 opacity-0 scale-95"
              }`}
            >
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4 animate-bounce">✍️</div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Your Signature Cart is Empty
                  </h3>
                  <p className="text-gray-600">
                    Ready to create your professional signature? Browse our
                    signature services!
                  </p>
                  <Link
                    to="/signature"
                    className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Explore Signature Services
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Layout */}
              <div
                className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-500 transform ${
                  animateElements
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                {/* Left Column - Cart Items and Additional Products */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div
                        key={item.id}
                        className={`transition-all duration-700 delay-${
                          index * 200
                        } transform ${
                          animateElements
                            ? "translate-x-0 opacity-100"
                            : "translate-x-8 opacity-0"
                        }`}
                      >
                        <CartItem
                          item={item}
                          onRemove={removeItem}
                          showRemoveButton={false}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Additional Products */}
                  <div
                    className={`transition-all duration-700 delay-700 transform ${
                      animateElements
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <AdditionalProducts
                      products={additionalProducts}
                      selectedProducts={selectedProducts}
                      onProductToggle={onProductToggle}
                    />
                  </div>
                </div>

                {/* Right Column - Forms and Summary */}
                <div className="space-y-6">
                  {/* Consultation Form */}
                  <div
                    className={`transition-all duration-700 delay-800 transform ${
                      animateElements
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <SignatureCartConsultationForm
                      onSubmit={handleConsultationFormSubmit}
                      formData={consultationFormData}
                      setFormData={setConsultationFormData}
                    />
                  </div>

                  {/* Order Summary */}
                  <div
                    className={`transition-all duration-700 delay-900 transform ${
                      animateElements
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <OrderSummary
                      discount={discount}
                      total={total}
                      totalMrp={totalMrp}
                      discountMrp={discountMrp}
                      couponDiscount={couponDiscount}
                      couponDiscountPercentage={couponDiscountPercentage}
                      ragCoupon={ragCoupon}
                      isCheckingOut={isCheckingOut}
                      onCheckout={doPayment}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonial />
    </div>
  );
}

export default SignatureNewCartCashFree;
