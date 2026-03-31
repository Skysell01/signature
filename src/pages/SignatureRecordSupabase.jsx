// src/pages/SignatureRecordSupabase.jsx

import React, { useState, useEffect } from "react";
import {
  FileText,
  Users,
  CalendarIcon,
  Search,
  CheckCircle,
  Download,
  ChevronDown,
} from "lucide-react";
import SignatureNavbar from "../components/signature/SignatureNavbar";
import { supabase } from "../utils/supabaseClient";

const SignatureRecordSupabase = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

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

  // 🔍 Filters
  const getFilteredOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));

      filtered = filtered.filter((o) => {
        const d = new Date(o.orderDate);

        if (dateFilter === "today") return d >= today;

        if (dateFilter === "last7days") {
          const last7 = new Date();
          last7.setDate(last7.getDate() - 7);
          return d >= last7;
        }

        if (dateFilter === "custom") {
          if (!customStartDate || !customEndDate) return true;
          return d >= new Date(customStartDate) && d <= new Date(customEndDate);
        }

        return true;
      });
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // 📄 CSV Export
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

  // UI States
  if (loading)
    return <div className="p-10 text-center">Loading orders...</div>;
  if (error)
    return <div className="p-10 text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <SignatureNavbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          Orders Dashboard
        </h1>

        {/* SEARCH + FILTER */}
        <div className="flex flex-wrap gap-4 mb-6 justify-between">

          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded w-64"
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

            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.orderId} className="border-b text-center">
                  <td className="p-3">{o.orderId}</td>
                  <td>{o.fullName}</td>
                  <td>{o.email}</td>
                  <td>{o.phoneNumber}</td>
                  <td>₹{o.amount}</td>

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

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-xl font-bold">{filteredOrders.length}</p>
            <p>Total Orders</p>
          </div>

          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-xl font-bold">
              ₹{filteredOrders.reduce((a, b) => a + b.amount, 0)}
            </p>
            <p>Revenue</p>
          </div>

          <div className="bg-white p-4 shadow rounded text-center">
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