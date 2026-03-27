// import React, { useEffect, useState } from "react";
// import {
//   Link,
//   useLocation,
//   useNavigate,
//   useSearchParams,
// } from "react-router-dom";
// import {
//   CheckCircle,
//   Star,
//   Sparkles,
//   ArrowLeft,
//   FileText,
//   AlertCircle,
//   Loader2,
//   RefreshCw,
// } from "lucide-react";
// import SignatureNavbar from "../components/signature/SignatureNavbar";
// import SignatureCTA from "../components/signature/SignatureCTA";
// import axios from "axios";
// import { BACKEND_URL } from "../utils/backendUrl";
// import { toast } from "react-toastify";

// const SignatureOrderConfirmationCashfree = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();

//   // State management
//   const [orderStatus, setOrderStatus] = useState("processing"); // processing, success, failed, verifying
//   const [orderData, setOrderData] = useState(null);
//   const [verificationAttempts, setVerificationAttempts] = useState(0);
//   const [isRetrying, setIsRetrying] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [retryCount, setRetryCount] = useState(0);

//   // Get order ID from URL params or location state
//   const orderIdFromParams = searchParams.get("orderId");
//   const orderIdFromState = location.state?.orderId;
//   const orderId = orderIdFromParams || orderIdFromState;

//   // Get other data from location state or localStorage
//   const { paymentMethod } = location.state || {};
//   const storedOrderData = localStorage.getItem("orderData")
//     ? JSON.parse(localStorage.getItem("orderData"))
//     : null;
//   const amount = storedOrderData?.amount;

//   const abandonedCartID = localStorage.getItem("abandonedCartID");

//   useEffect(() => {
//     window.scrollTo({ top: 0, left: 0, behavior: "instant" });

//     // If no order ID, redirect to cart
//     if (!orderId) {
//       console.error("No order ID found");
//       setOrderStatus("failed");
//       setErrorMessage("Invalid order. Please try again.");
//       toast.error("No order ID found. Redirecting to cart.");
//       setTimeout(() => navigate("/signature-cart"), 2000);
//       return;
//     }

//     // Start verification process
//     createOrderInDatabase();
//   }, [orderId]);

//   // Create order in database
//   const createOrderInDatabase = async () => {
//     try {
//       console.log("Creating order in database...");

//      const orderPayload = {
//   orderId: orderId,
//   amount: storedOrderData?.amount || amount,
//   fullName: storedOrderData?.fullName,
//   email: storedOrderData?.email,
//   phoneNumber: storedOrderData?.phoneNumber,
//   profession: storedOrderData?.profession,
//   remarks: storedOrderData?.remarks,
//   additionalProducts: storedOrderData?.additionalProducts || [],
// };

// // Safety check — log before sending
// console.log("Sending order payload:", orderPayload);

//       const orderResponse = await axios.post(
//         `${BACKEND_URL}/api/lander4/create-order`,
//         orderPayload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
//           },
//           timeout: 20000, // 20 second timeout
//         }
//       );

//       console.log("Order creation response:", orderResponse.data);

//       if (orderResponse?.data?.success) {
//         setOrderData(orderResponse.data);
//         setOrderStatus("success");
//         toast.success("Order placed successfully!");

//         // Clear stored order data
//         localStorage.removeItem("orderData");

//         // Clear abandoned cart if exists
//         await axios.delete(
//           `${BACKEND_URL}/api/lander4/delete-order-abd/${abandonedCartID}`
//         );

//         // Clear abandoned cart ID
//         localStorage.removeItem("abandonedCartID");
//       } else {
//         throw new Error(
//           orderResponse?.data?.message || "Failed to create order"
//         );
//       }
//     } catch (error) {
//       console.error("Order creation error:", error);

//       if (error.response?.status === 409) {
//         // Order already exists
//         setOrderStatus("success");
//         toast.info("Order already exists and is confirmed.");
//       } else if (error.response?.status === 400) {
//         setErrorMessage("Invalid order data. Please contact support.");
//         setOrderStatus("failed");
//       } else {
//         setErrorMessage(
//           "Order creation failed. Payment was successful but order could not be created."
//         );
//         setOrderStatus("failed");
//         toast.error(
//           "Order creation failed. Please contact support with your payment details."
//         );
//       }
//     }
//   };

//   // Retry verification
//   const handleRetry = () => {
//     setIsRetrying(true);
//     setVerificationAttempts(0);
//     setErrorMessage("");
//     setRetryCount((prev) => prev + 1);
//     setTimeout(() => setIsRetrying(false), 1000);
//   };

//   // Loading state
//   if (orderStatus === "processing" || orderStatus === "verifying") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center">
//         <div className="text-center space-y-6">
//           <div className="relative">
//             <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full blur-xl"></div>
//           </div>
//           <div className="space-y-2">
//             <h2 className="text-2xl font-bold text-gray-800">
//               {orderStatus === "processing"
//                 ? "Processing your order..."
//                 : "Verifying payment..."}
//             </h2>
//             <p className="text-gray-600">
//               {orderStatus === "processing"
//                 ? "Please wait while we process your order."
//                 : "We are verifying your payment with Cashfree."}
//             </p>
//             {/* {verifiabandonedCartID */}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Failed state
//   if (orderStatus === "failed") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center">
//         <div className="max-w-md mx-auto text-center space-y-6">
//           <div className="relative">
//             <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
//             <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl"></div>
//           </div>
//           <div className="space-y-4">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Order Verification Failed
//             </h2>
//             <p className="text-gray-600">{errorMessage}</p>
//             <div className="space-y-3">
//               <button
//                 onClick={handleRetry}
//                 disabled={isRetrying}
//                 className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//               >
//                 {isRetrying ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     <span>Retrying...</span>
//                   </>
//                 ) : (
//                   <>
//                     <RefreshCw className="w-4 h-4" />
//                     <span>Try Again</span>
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={() => navigate("/signature-cart")}
//                 className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
//               >
//                 Back to Cart
//               </button>
//             </div>
//             {retryCount > 0 && (
//               <p className="text-sm text-gray-500">
//                 Retry attempts: {retryCount}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Success state continues with existing UI...

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 selection:bg-gray-500/20 selection:text-gray-800">
//       <SignatureNavbar />

//       {/* Animated Background */}
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 via-white/30 to-blue-100/50"></div>
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_50%)]"></div>

//         {/* Floating Signature Elements */}
//         {[...Array(12)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute animate-pulse"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 3}s`,
//               animationDuration: `${3 + Math.random() * 2}s`,
//             }}
//           >
//             <FileText
//               className={`w-2 h-2 ${
//                 i % 3 === 0
//                   ? "text-gray-400"
//                   : i % 3 === 1
//                   ? "text-blue-400"
//                   : "text-black"
//               } opacity-60`}
//               fill="currentColor"
//             />
//           </div>
//         ))}
//       </div>

//       <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-16">
//         {/* Success Animation Container */}
//         <div className="text-center mb-8">
//           <div className="relative inline-block">
//             <div className="absolute -inset-4 bg-gradient-to-r from-gray-500/20 via-black/20 to-gray-500/20 rounded-full blur-2xl animate-pulse"></div>
//             <div className="relative bg-white/25 backdrop-blur-xl rounded-full p-6 border border-white/30 shadow-xl">
//               <CheckCircle className="w-16 h-16 text-gray-800 animate-bounce" />
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="space-y-8">
//           {/* Header */}
//           <div className="text-center space-y-4">
//             <div className="inline-flex items-center space-x-2 bg-white/25 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
//               <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
//               <span className="text-gray-700 text-sm font-medium font-primary">
//                 Order Confirmed
//               </span>
//             </div>

//             <h1 className="text-3xl sm:text-5xl font-bold leading-tight font-display">
//               <span className="text-gray-800">Thank You!</span>
//               <span className="bg-gradient-to-r from-gray-800 via-black to-gray-800 bg-clip-text text-transparent pl-2">
//                 Signature Design Ordered
//               </span>
//             </h1>

//             <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto font-primary">
//               Your Professional Signature Design has been successfully ordered.
//               Our expert designer will create your personalized signature and
//               deliver it within 24-48 hours.
//             </p>
//           </div>

//           {/* Order Details Card */}
//           <div className="relative group">
//             <div className="absolute -inset-2 bg-gradient-to-r from-gray-500/20 via-black/20 to-gray-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
//             <div className="relative bg-white/25 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/30 shadow-xl">
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-semibold text-gray-800 font-display">
//                     Order Details
//                   </h3>
//                   <div className="flex items-center space-x-1">
//                     <Star className="w-4 h-4 text-gray-800 fill-current" />
//                     <Star className="w-4 h-4 text-gray-800 fill-current" />
//                     <Star className="w-4 h-4 text-gray-800 fill-current" />
//                     <Star className="w-4 h-4 text-gray-800 fill-current" />
//                     <Star className="w-4 h-4 text-gray-800 fill-current" />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <p className="text-gray-600 text-sm font-primary">
//                       Order ID
//                     </p>
//                     <p className="text-gray-800 font-mono">{orderId}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-gray-600 text-sm font-primary">
//                       Service
//                     </p>
//                     <p className="text-gray-800 font-primary">
//                       Professional Signature Design
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-gray-600 text-sm font-primary">
//                       Amount Paid
//                     </p>
//                     <p className="text-gray-800 font-semibold">
//                       ₹{storedOrderData?.amount || "N/A"}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-gray-600 text-sm font-primary">
//                       Payment Method
//                     </p>
//                     <p className="text-gray-800 font-primary">
//                       {"Cashfree"}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-gray-600 text-sm font-primary">Status</p>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-green-600 font-medium font-primary">
//                         Confirmed
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* What's Next */}
//           <div className="space-y-6">
//             <h3 className="text-2xl font-bold text-center text-gray-800 font-display">
//               What's Next?
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="relative group">
//                 <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 to-black/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
//                 <div className="relative bg-white/25 backdrop-blur-xl rounded-xl p-6 border border-white/30 text-center shadow-xl">
//                   <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-4">
//                     <FileText
//                       className="w-6 h-6 text-white"
//                       fill="currentColor"
//                     />
//                   </div>
//                   <h4 className="text-gray-800 font-semibold mb-2 font-display">
//                     Design Analysis
//                   </h4>
//                   <p className="text-gray-600 text-sm font-primary">
//                     Our expert will analyze your personality and create unique
//                     designs
//                   </p>
//                 </div>
//               </div>

//               <div className="relative group">
//                 <div className="absolute -inset-1 bg-gradient-to-r from-black/20 to-gray-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
//                 <div className="relative bg-white/25 backdrop-blur-xl rounded-xl p-6 border border-white/30 text-center shadow-xl">
//                   <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Sparkles className="w-6 h-6 text-white" />
//                   </div>
//                   <h4 className="text-gray-800 font-semibold mb-2 font-display">
//                     Personalized Design
//                   </h4>
//                   <p className="text-gray-600 text-sm font-primary">
//                     Receive your custom signature design in multiple formats
//                   </p>
//                 </div>
//               </div>

//               <div className="relative group">
//                 <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 to-black/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
//                 <div className="relative bg-white/25 backdrop-blur-xl rounded-xl p-6 border border-white/30 text-center shadow-xl">
//                   <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Star className="w-6 h-6 text-white" />
//                   </div>
//                   <h4 className="text-gray-800 font-semibold mb-2 font-display">
//                     Professional Guidance
//                   </h4>
//                   <p className="text-gray-600 text-sm font-primary">
//                     Get tips on using your new signature effectively
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
//             <Link to="/signature" className="group relative">
//               <div className="absolute -inset-2 bg-gradient-to-r from-white/25 to-white/15 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
//               <button className="relative bg-white/25 backdrop-blur-xl rounded-full border border-white/30 shadow-xl text-gray-800 px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-primary">
//                 <ArrowLeft className="w-4 h-4" />
//                 <span>Back to Home</span>
//               </button>
//             </Link>

//             <SignatureCTA
//               text="Order Another Design"
//               className="w-full sm:w-auto"
//             />
//           </div>

//           {/* Additional Info */}
//           <div className="text-center space-y-4 pt-8 border-t border-white/30">
//             <p className="text-gray-600 text-sm font-primary">
//               Need immediate assistance? Contact us at{" "}
//               <span className="text-gray-800 font-medium">
//                 support@easysoul.com
//               </span>
//             </p>
//             <p className="text-gray-500 text-xs font-primary">
//               You will receive a confirmation email shortly with all the
//               details.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignatureOrderConfirmationCashfree;
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
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import SignatureNavbar from "../components/signature/SignatureNavbar";
import SignatureCTA from "../components/signature/SignatureCTA";
import axios from "axios";
import { BACKEND_URL } from "../utils/backendUrl";
import { toast } from "react-toastify";

const SignatureOrderConfirmationCashfree = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [orderStatus, setOrderStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const orderId =
    searchParams.get("orderId") || location.state?.orderId;

  const storedOrderData = localStorage.getItem("orderData")
    ? JSON.parse(localStorage.getItem("orderData"))
    : null;

  const abandonedCartID = localStorage.getItem("abandonedCartID");

  // 🔥 VERIFY PAYMENT FIRST
  const verifyPayment = async () => {
    try {
      setOrderStatus("verifying");

      const res = await axios.get(
        `${BACKEND_URL}/api/payment/verify/${orderId}`
      );

      console.log("Payment verify response:", res.data);

      const payments = res?.data?.data;

      if (!payments || payments.length === 0) {
        throw new Error("No payment found");
      }

      const payment = payments[0];

      if (payment.payment_status === "SUCCESS") {
        console.log("✅ Payment SUCCESS");

        await createOrderInDatabase();
      } else {
        console.log("❌ Payment FAILED / CANCELLED");

        setOrderStatus("failed");
        setErrorMessage("Payment was cancelled or failed.");
      }
    } catch (err) {
      console.error(err);
      setOrderStatus("failed");
      setErrorMessage("Payment verification failed.");
    }
  };

  // ✅ CREATE ORDER ONLY AFTER SUCCESS
  const createOrderInDatabase = async () => {
    try {
      const payload = {
        orderId: orderId,
        amount: storedOrderData?.amount,
        fullName: storedOrderData?.fullName,
        email: storedOrderData?.email,
        phoneNumber: storedOrderData?.phoneNumber,
        profession: storedOrderData?.profession,
        remarks: storedOrderData?.remarks,
        additionalProducts: storedOrderData?.additionalProducts || [],
      };

      const res = await axios.post(
        `${BACKEND_URL}/api/lander4/create-order`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (res?.data?.success) {
        setOrderStatus("success");
        toast.success("Order placed successfully!");

        localStorage.removeItem("orderData");

        if (abandonedCartID) {
          await axios.delete(
            `${BACKEND_URL}/api/lander4/delete-order-abd/${abandonedCartID}`
          );
          localStorage.removeItem("abandonedCartID");
        }
      } else {
        throw new Error("Order creation failed");
      }
    } catch (err) {
      console.error(err);
      setOrderStatus("failed");
      setErrorMessage("Order creation failed after payment.");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    if (!orderId) {
      setOrderStatus("failed");
      setErrorMessage("No order ID found.");
      setTimeout(() => navigate("/signature-cart"), 2000);
      return;
    }

    verifyPayment(); // 🔥 MAIN FIX
  }, [orderId]);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);
    setTimeout(() => {
      setIsRetrying(false);
      verifyPayment();
    }, 1000);
  };

  // ⏳ LOADING UI
  if (orderStatus === "processing" || orderStatus === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  // ❌ FAILED UI
  if (orderStatus === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold mt-4">
            Payment Failed / Cancelled
          </h2>
          <p className="text-gray-600">{errorMessage}</p>

          <button
            onClick={handleRetry}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>

          <button
            onClick={() => navigate("/signature-cart")}
            className="mt-2 block mx-auto text-gray-600"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  // ✅ SUCCESS UI
  return (
    <div className="min-h-screen text-center pt-20">
      <SignatureNavbar />

      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />

      <h1 className="text-3xl font-bold mt-4">
        Payment Successful 🎉
      </h1>

      <p className="mt-2 text-gray-600">
        Your order has been confirmed.
      </p>

      <p className="mt-4 font-mono">{orderId}</p>

      <Link to="/signature">
        <button className="mt-6 bg-black text-white px-6 py-2 rounded">
          Back to Home
        </button>
      </Link>

      <SignatureCTA text="Order Another Design" />
    </div>
  );
};

export default SignatureOrderConfirmationCashfree;
