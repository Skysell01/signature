// // src/pages/SignatureRecordSupabase.jsx

// import React, { useState, useEffect } from "react";
// import {
//   FileText,
//   Users,
//   Search,
//   Download,
// } from "lucide-react";
// import SignatureNavbar from "../components/signature/SignatureNavbar";
// import { supabase } from "../utils/supabaseClient";

// const SignatureRecordSupabase = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);

//       const { data, error } = await supabase
//         .from("orders")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) throw error;

//       const formatted = data.map((order) => ({
//         orderId: order.order_id || order.cashfree_order_id,
//         fullName: order.full_name,
//         email: order.email,
//         phoneNumber: order.phone_number,
//         profession: order.profession,
//         remarks: order.remarks,
//         additionalProducts: order.additional_products || [],
//         amount: order.amount,
//         orderDate: order.created_at,
//         status: order.status || order.payment_status,
//       }));

//       setOrders(formatted);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDateTime = (date) => {
//   return new Date(date).toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

//   const filteredOrders = orders.filter(
//     (o) =>
//       o.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const exportToCSV = () => {
//     const headers = [
//       "Order ID",
//       "Name",
//       "Email",
//       "Phone",
//       "Amount",
//       "Status",
//       "Date",
//     ];

//     const rows = filteredOrders.map((o) => [
//       o.orderId,
//       o.fullName,
//       o.email,
//       o.phoneNumber,
//       o.amount,
//       o.status,
//       formatDateTime(o.orderDate),
//     ]);

//     const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

//     const blob = new Blob([csv]);
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "orders.csv";
//     link.click();
//   };

//   // Loading
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 text-black">
//         <SignatureNavbar />
//         <div className="p-10 text-center">Loading orders...</div>
//       </div>
//     );
//   }

//   // Error
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 text-black">
//         <SignatureNavbar />
//         <div className="p-10 text-center text-red-500">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 text-black">
//       <SignatureNavbar />

//       <div className="max-w-7xl mx-auto p-6">

//         {/* HEADER */}
//         <h1 className="text-3xl font-bold mb-6 text-center text-black">
//           Orders Dashboard
//         </h1>

//         {/* SEARCH + EXPORT */}
//         <div className="flex flex-wrap gap-4 mb-6 justify-between">

//           <input
//             type="text"
//             placeholder="Search..."
//             className="border p-2 rounded w-64 text-black placeholder-gray-500 bg-white"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           <button
//             onClick={exportToCSV}
//             className="bg-black text-white px-4 py-2 rounded"
//           >
//             Export CSV
//           </button>
//         </div>

//         {/* TABLE */}
//         <div className="bg-white rounded shadow overflow-auto">
//           <table className="w-full text-sm">
            
//             {/* HEADER */}
//             <thead className="bg-black text-white">
//               <tr>
//                 <th className="p-3">Order ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Date</th>
//               </tr>
//             </thead>

//             {/* BODY */}
//             <tbody className="text-black">
//               {filteredOrders.map((o, index) => (
//                 <tr
//                   key={o.orderId}
//                   className={`border-b text-center ${
//                     index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   }`}
//                 >
//                   <td className="p-3">{o.orderId}</td>
//                   <td>{o.fullName}</td>
//                   <td>{o.email}</td>
//                   <td>{o.phoneNumber}</td>
//                   <td>₹{o.amount}</td>

//                   {/* STATUS */}
//                   <td>
//                     <span
//                       className={`px-2 py-1 rounded text-xs ${
//                         o.status === "PAID"
//                           ? "bg-green-200 text-green-800"
//                           : "bg-yellow-200 text-yellow-800"
//                       }`}
//                     >
//                       {o.status}
//                     </span>
//                   </td>

//                   <td>{formatDateTime(o.orderDate)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* EMPTY STATE */}
//         {filteredOrders.length === 0 && (
//           <div className="text-center py-10 text-gray-600">
//             No orders found
//           </div>
//         )}

//         {/* STATS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

//           <div className="bg-white p-4 shadow rounded text-center text-black">
//             <p className="text-xl font-bold">{filteredOrders.length}</p>
//             <p>Total Orders</p>
//           </div>

//           <div className="bg-white p-4 shadow rounded text-center text-black">
//             <p className="text-xl font-bold">
//               ₹{filteredOrders.reduce((a, b) => a + b.amount, 0)}
//             </p>
//             <p>Revenue</p>
//           </div>

//           <div className="bg-white p-4 shadow rounded text-center text-black">
//             <p className="text-xl font-bold">
//               {new Set(filteredOrders.map((o) => o.email)).size}
//             </p>
//             <p>Customers</p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignatureRecordSupabase;


// src/pages/SignatureRecordSupabase.jsx

// import React, { useState, useEffect } from "react";
// import {
//   FileText,
//   Users,
//   Search,
//   Download,
// } from "lucide-react";
// import SignatureNavbar from "../components/signature/SignatureNavbar";
// import { supabase } from "../utils/supabaseClient";

// const SignatureRecordSupabase = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);

//       const { data, error } = await supabase
//         .from("orders")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) throw error;

//       // ✅ SAFE + CLEAN MAPPING
//       const formatted = data.map((order) => ({
//         orderId: order.order_id || "N/A",
//         fullName: order.full_name || "Guest User",
//         email: order.email || "No Email",
//         phoneNumber: order.phone_number || "No Phone",
//         profession: order.profession || "N/A",
//         remarks: order.remarks || "",
//         additionalProducts: order.additional_products || [],
//         amount: Number(order.amount || 0),
//         orderDate: order.created_at,
//         status: order.status || "PENDING",
//       }));

//       setOrders(formatted);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDateTime = (date) => {
//     return new Date(date).toLocaleString("en-IN", {
//       timeZone: "Asia/Kolkata",
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const filteredOrders = orders.filter(
//     (o) =>
//       o.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const exportToCSV = () => {
//     const headers = [
//       "Order ID",
//       "Name",
//       "Email",
//       "Phone",
//       "Amount",
//       "Status",
//       "Date",
//     ];

//     const rows = filteredOrders.map((o) => [
//       o.orderId,
//       o.fullName,
//       o.email,
//       o.phoneNumber,
//       o.amount,
//       o.status,
//       formatDateTime(o.orderDate),
//     ]);

//     const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

//     const blob = new Blob([csv]);
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "orders.csv";
//     link.click();
//   };

//   // Loading
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 text-black">
//         <SignatureNavbar />
//         <div className="p-10 text-center">Loading orders...</div>
//       </div>
//     );
//   }

//   // Error
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 text-black">
//         <SignatureNavbar />
//         <div className="p-10 text-center text-red-500">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 text-black">
//       <SignatureNavbar />

//       <div className="max-w-7xl mx-auto p-6">

//         {/* HEADER */}
//         <h1 className="text-3xl font-bold mb-6 text-center text-black">
//           Orders Dashboard
//         </h1>

//         {/* SEARCH + EXPORT */}
//         <div className="flex flex-wrap gap-4 mb-6 justify-between">

//           <input
//             type="text"
//             placeholder="Search..."
//             className="border p-2 rounded w-64 text-black placeholder-gray-500 bg-white"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           <button
//             onClick={exportToCSV}
//             className="bg-black text-white px-4 py-2 rounded"
//           >
//             Export CSV
//           </button>
//         </div>

//         {/* TABLE */}
//         <div className="bg-white rounded shadow overflow-auto">
//           <table className="w-full text-sm">
            
//             {/* HEADER */}
//             <thead className="bg-black text-white">
//               <tr>
//                 <th className="p-3">Order ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Date</th>
//               </tr>
//             </thead>

//             {/* BODY */}
//             <tbody className="text-black">
//               {filteredOrders.map((o, index) => (
//                 <tr
//                   key={o.orderId}
//                   className={`border-b text-center ${
//                     index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   }`}
//                 >
//                   <td className="p-3">{o.orderId}</td>
//                   <td>{o.fullName}</td>
//                   <td>{o.email}</td>
//                   <td>{o.phoneNumber}</td>
//                   <td>₹{o.amount}</td>

//                   {/* ✅ IMPROVED STATUS */}
//                   <td>
//                     <span
//                       className={`px-2 py-1 rounded text-xs ${
//                         o.status === "PAID"
//                           ? "bg-green-200 text-green-800"
//                           : o.status === "PENDING"
//                           ? "bg-yellow-200 text-yellow-800"
//                           : "bg-red-200 text-red-800"
//                       }`}
//                     >
//                       {o.status}
//                     </span>
//                   </td>

//                   <td>{formatDateTime(o.orderDate)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* EMPTY STATE */}
//         {filteredOrders.length === 0 && (
//           <div className="text-center py-10 text-gray-600">
//             No orders found
//           </div>
//         )}

//         {/* STATS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

//           <div className="bg-white p-4 shadow rounded text-center text-black">
//             <p className="text-xl font-bold">{filteredOrders.length}</p>
//             <p>Total Orders</p>
//           </div>

//           <div className="bg-white p-4 shadow rounded text-center text-black">
//             <p className="text-xl font-bold">
//               ₹{
//                 filteredOrders
//                   .filter((o) => o.status === "PAID")
//                   .reduce((a, b) => a + Number(b.amount || 0), 0)
//               }
//             </p>
//             <p>Revenue</p>
//           </div>

//           <div className="bg-white p-4 shadow rounded text-center text-black">
//             <p className="text-xl font-bold">
//               {new Set(filteredOrders.map((o) => o.email)).size}
//             </p>
//             <p>Customers</p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignatureRecordSupabase;








import React, { useState, useEffect } from "react";
import SignatureNavbar from "../components/signature/SignatureNavbar";
import { supabase } from "../utils/supabaseClient";

const SignatureRecordSupabase = () => {
  const [authed, setAuthed]     = useState(false);
  const [pass, setPass]         = useState("");
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = data.map((order) => ({
        orderId:            order.cashfree_order_id || "N/A",
        fullName:           order.full_name         || "Guest User",
        email:              order.email             || "No Email",
        phoneNumber:        order.phone_number      || "No Phone",
        profession:         order.profession        || "N/A",
        remarks:            order.remarks           || "",
        additionalProducts: order.additional_products || [],
        couponCode:         order.coupon_code       || null,
        couponDiscount:     order.coupon_discount   || 0,
        amount:             Number(order.amount     || 0),
        orderDate:          order.created_at,
        status:             order.payment_status    || "PENDING",
      }));

      setOrders(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });

  const handleLogin = () => {
    if (pass === import.meta.env.VITE_ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      alert("Wrong password");
    }
  };

  const exportToCSV = () => {
    const headers = ["Order ID","Name","Email","Phone","Profession","Remarks","Add-ons","Coupon","Discount","Amount","Status","Date"];
    const rows = filteredOrders.map((o) => [
      o.orderId, o.fullName, o.email, o.phoneNumber,
      o.profession, o.remarks,
      o.additionalProducts.join(" | "),
      o.couponCode || "-", o.couponDiscount,
      o.amount, o.status,
      formatDateTime(o.orderDate),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders.csv";
    link.click();
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Password gate ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow space-y-4 w-80 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Admin Access</h2>
          <p className="text-gray-500 text-sm">Enter password to view orders</p>
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-full text-black"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SignatureNavbar />
        <div className="p-10 text-center text-gray-600">Loading orders...</div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SignatureNavbar />
        <div className="p-10 text-center text-red-500">{error}</div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <SignatureNavbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Orders Dashboard</h1>

        {/* Search + Export */}
        <div className="flex flex-wrap gap-4 mb-6 justify-between">
          <input
            type="text"
            placeholder="Search by name, email or order ID..."
            className="border p-2 rounded w-72 text-black placeholder-gray-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={exportToCSV}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Profession</th>
                <th className="p-3 text-left">Add-ons</th>
                <th className="p-3 text-left">Coupon</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o, index) => (
                <tr
                  key={o.orderId}
                  className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-3 text-xs text-gray-500">{o.orderId}</td>
                  <td className="p-3 font-medium">{o.fullName}</td>
                  <td className="p-3">{o.email}</td>
                  <td className="p-3">{o.phoneNumber}</td>
                  <td className="p-3">{o.profession}</td>
                  <td className="p-3 text-xs">
                    {o.additionalProducts.length > 0
                      ? o.additionalProducts.join(", ")
                      : "—"}
                  </td>
                  <td className="p-3 text-xs">
                    {o.couponCode
                      ? `${o.couponCode} (-₹${o.couponDiscount})`
                      : "—"}
                  </td>
                  <td className="p-3 font-semibold">₹{o.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      o.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : o.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-gray-500">
                    {formatDateTime(o.orderDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-gray-500">No orders found</div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-2xl font-bold">{filteredOrders.length}</p>
            <p className="text-gray-500 text-sm">Total Orders</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-2xl font-bold text-green-600">
              ₹{filteredOrders
                .filter((o) => o.status === "PAID")
                .reduce((a, b) => a + b.amount, 0)}
            </p>
            <p className="text-gray-500 text-sm">Revenue (Paid only)</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-2xl font-bold">
              {new Set(filteredOrders.map((o) => o.email)).size}
            </p>
            <p className="text-gray-500 text-sm">Unique Customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureRecordSupabase;