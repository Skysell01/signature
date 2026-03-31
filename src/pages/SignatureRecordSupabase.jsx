// src/pages/SignatureRecordSupabase.jsx

import React, { useState, useEffect } from "react";
import {
  FileText,
  Users,
  Search,
  Download,
} from "lucide-react";
import SignatureNavbar from "../components/signature/SignatureNavbar";
import { supabase } from "../utils/supabaseClient";

const SignatureRecordSupabase = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = data.map((order) => ({
        orderId: order.order_id || order.cashfree_order_id,
        fullName: order.full_name,
        email: order.email,
        phoneNumber: order.phone_number,
        profession: order.profession,
        remarks: order.remarks,
        additionalProducts: order.additional_products || [],
        amount: order.amount,
        orderDate: order.created_at,
        status: order.status || order.payment_status,
      }));

      setOrders(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) => new Date(date).toLocaleString();

  const filteredOrders = orders.filter(
    (o) =>
      o.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Name",
      "Email",
      "Phone",
      "Amount",
      "Status",
      "Date",
    ];

    const rows = filteredOrders.map((o) => [
      o.orderId,
      o.fullName,
      o.email,
      o.phoneNumber,
      o.amount,
      o.status,
      formatDateTime(o.orderDate),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders.csv";
    link.click();
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-black">
        <SignatureNavbar />
        <div className="p-10 text-center">Loading orders...</div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-black">
        <SignatureNavbar />
        <div className="p-10 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <SignatureNavbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Orders Dashboard
        </h1>

        {/* SEARCH + EXPORT */}
        <div className="flex flex-wrap gap-4 mb-6 justify-between">

          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded w-64 text-black placeholder-gray-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            onClick={exportToCSV}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-sm">
            
            {/* HEADER */}
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3">Order ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="text-black">
              {filteredOrders.map((o, index) => (
                <tr
                  key={o.orderId}
                  className={`border-b text-center ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3">{o.orderId}</td>
                  <td>{o.fullName}</td>
                  <td>{o.email}</td>
                  <td>{o.phoneNumber}</td>
                  <td>₹{o.amount}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        o.status === "PAID"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td>{formatDateTime(o.orderDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-gray-600">
            No orders found
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

          <div className="bg-white p-4 shadow rounded text-center text-black">
            <p className="text-xl font-bold">{filteredOrders.length}</p>
            <p>Total Orders</p>
          </div>

          <div className="bg-white p-4 shadow rounded text-center text-black">
            <p className="text-xl font-bold">
              ₹{filteredOrders.reduce((a, b) => a + b.amount, 0)}
            </p>
            <p>Revenue</p>
          </div>

          <div className="bg-white p-4 shadow rounded text-center text-black">
            <p className="text-xl font-bold">
              {new Set(filteredOrders.map((o) => o.email)).size}
            </p>
            <p>Customers</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignatureRecordSupabase;