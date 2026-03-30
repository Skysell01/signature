// import React, { useState, useEffect } from 'react';
// import {
//   FileText, Users, Calendar, Phone, Mail, User,
//   CheckCircle, Download, CalendarIcon, ChevronDown,
//   Search, AlertCircle, ShoppingBag, TrendingUp
// } from 'lucide-react';
// import SignatureNavbar from '../components/signature/SignatureNavbar';
// import { supabase } from '../utils/supabaseClient';

// const SupabaseRecord = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dateFilter, setDateFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [customStartDate, setCustomStartDate] = useState('');
//   const [customEndDate, setCustomEndDate] = useState('');
//   const [showDateDropdown, setShowDateDropdown] = useState(false);
//   const [showStatusDropdown, setShowStatusDropdown] = useState(false);
//   const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showDateDropdown && !event.target.closest('.date-filter-dropdown')) {
//         setShowDateDropdown(false);
//       }
//       if (showStatusDropdown && !event.target.closest('.status-filter-dropdown')) {
//         setShowStatusDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showDateDropdown, showStatusDropdown]);

//   const fetchOrders = async () => {
//     try {
//       const { data, error: supabaseError } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (supabaseError) {
//         setError('Failed to fetch orders from Supabase: ' + supabaseError.message);
//       } else {
//         setOrders(data || []);
//       }
//     } catch (err) {
//       setError('Error connecting to Supabase: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDateTime = (dateTimeString) => {
//     return new Date(dateTimeString).toLocaleString();
//   };

//   // Date filtering
//   const getDateFilteredOrders = (orders) => {
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
//     const lastWeek = new Date(today);
//     lastWeek.setDate(lastWeek.getDate() - 7);

//     return orders.filter(order => {
//       const orderDate = new Date(order.created_at);
//       const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());

//       switch (dateFilter) {
//         case 'today':
//           return orderDay.getTime() === today.getTime();
//         case 'yesterday':
//           return orderDay.getTime() === yesterday.getTime();
//         case 'last7days':
//           return orderDate >= lastWeek;
//         case 'custom':
//           if (customStartDate && customEndDate) {
//             const startDate = new Date(customStartDate);
//             const endDate = new Date(customEndDate);
//             endDate.setHours(23, 59, 59, 999);
//             return orderDate >= startDate && orderDate <= endDate;
//           }
//           return true;
//         default:
//           return true;
//       }
//     });
//   };

//   // CSV export
//   const exportToCSV = () => {
//     const csvHeaders = [
//       'ID', 'Name', 'Email', 'Phone', 'Profession',
//       'Remarks', 'Additional Products', 'Amount',
//       'Payment Status', 'Cashfree Order ID',
//       'Coupon Code', 'Coupon Discount', 'Created At'
//     ];

//     const csvData = filteredOrders.map(order => [
//       order.id,
//       order.full_name,
//       order.email,
//       order.phone_number,
//       order.profession,
//       order.remarks || 'No remarks',
//       order.additional_products ? order.additional_products.join(', ') : 'Signature Design',
//       order.amount,
//       order.payment_status,
//       order.cashfree_order_id || 'N/A',
//       order.coupon_code || 'None',
//       order.coupon_discount || 0,
//       formatDateTime(order.created_at),
//     ]);

//     const csvContent = [
//       csvHeaders.join(','),
//       ...csvData.map(row =>
//         row.map(field =>
//           typeof field === 'string' && field.includes(',')
//             ? `"${field.replace(/"/g, '""')}"`
//             : field
//         ).join(',')
//       )
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.setAttribute('href', URL.createObjectURL(blob));
//     link.setAttribute('download', `supabase_orders_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const dateFilterOptions = [
//     { value: 'all', label: 'All Time' },
//     { value: 'today', label: 'Today' },
//     { value: 'yesterday', label: 'Yesterday' },
//     { value: 'last7days', label: 'Last 7 Days' },
//     { value: 'custom', label: 'Custom Range' },
//   ];

//   const statusFilterOptions = [
//     { value: 'all', label: 'All Status' },
//     { value: 'paid', label: 'Paid' },
//     { value: 'abandoned', label: 'Abandoned' },
//     { value: 'pending', label: 'Pending' },
//   ];

//   const handleDateFilterChange = (value) => {
//     setDateFilter(value);
//     setShowDateDropdown(false);
//     setShowCustomDatePicker(value === 'custom');
//     if (value !== 'custom') {
//       setCustomStartDate('');
//       setCustomEndDate('');
//     }
//   };

//   const handleStatusFilterChange = (value) => {
//     setStatusFilter(value);
//     setShowStatusDropdown(false);
//   };

//   const dateFilteredOrders = getDateFilteredOrders(orders);

//   const filteredOrders = dateFilteredOrders
//     .filter(order => statusFilter === 'all' || order.payment_status === statusFilter)
//     .filter(order =>
//       order.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.cashfree_order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   const paidOrders = filteredOrders.filter(o => o.payment_status === 'paid');
//   const abandonedOrders = filteredOrders.filter(o => o.payment_status === 'abandoned');
//   const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'paid':
//         return (
//           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
//             <CheckCircle className="w-3 h-3" /> Paid
//           </span>
//         );
//       case 'abandoned':
//         return (
//           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
//             <AlertCircle className="w-3 h-3" /> Abandoned
//           </span>
//         );
//       default:
//         return (
//           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
//             <AlertCircle className="w-3 h-3" /> {status}
//           </span>
//         );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
//         <SignatureNavbar />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading Supabase records...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
//         <SignatureNavbar />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <div className="text-4xl mb-4">⚠️</div>
//             <p className="text-red-600">{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
//       <SignatureNavbar />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
//             Supabase Order Records
//           </h1>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             All orders synced to Supabase — including paid and abandoned carts
//           </p>
//         </div>

//         {/* Search + Filters */}
//         <div className="max-w-5xl mx-auto mb-8">
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

//             {/* Search */}
//             <div className="flex-1 max-w-md">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, or order ID..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-3">

//               {/* Status Filter */}
//               <div className="relative status-filter-dropdown">
//                 <button
//                   onClick={() => setShowStatusDropdown(!showStatusDropdown)}
//                   className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
//                 >
//                   <CheckCircle className="w-4 h-4 text-gray-600" />
//                   <span className="text-gray-700 text-sm">
//                     {statusFilterOptions.find(o => o.value === statusFilter)?.label}
//                   </span>
//                   <ChevronDown className="w-4 h-4 text-gray-600" />
//                 </button>
//                 {showStatusDropdown && (
//                   <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                     {statusFilterOptions.map(option => (
//                       <button
//                         key={option.value}
//                         onClick={() => handleStatusFilterChange(option.value)}
//                         className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg text-sm ${
//                           statusFilter === option.value ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700'
//                         }`}
//                       >
//                         {option.label}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Date Filter */}
//               <div className="relative date-filter-dropdown">
//                 <button
//                   onClick={() => setShowDateDropdown(!showDateDropdown)}
//                   className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
//                 >
//                   <CalendarIcon className="w-4 h-4 text-gray-600" />
//                   <span className="text-gray-700 text-sm">
//                     {dateFilterOptions.find(o => o.value === dateFilter)?.label}
//                   </span>
//                   <ChevronDown className="w-4 h-4 text-gray-600" />
//                 </button>
//                 {showDateDropdown && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                     {dateFilterOptions.map(option => (
//                       <button
//                         key={option.value}
//                         onClick={() => handleDateFilterChange(option.value)}
//                         className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg text-sm ${
//                           dateFilter === option.value ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700'
//                         }`}
//                       >
//                         {option.label}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Export CSV */}
//               <button
//                 onClick={exportToCSV}
//                 className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-lg hover:from-gray-900 hover:to-gray-800 transition-all duration-200 shadow-lg text-sm"
//               >
//                 <Download className="w-4 h-4" />
//                 <span>Export CSV</span>
//               </button>
//             </div>
//           </div>

//           {/* Custom Date Picker */}
//           {showCustomDatePicker && (
//             <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <div className="flex flex-col sm:flex-row gap-4 items-center">
//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
//                   <input
//                     type="date"
//                     value={customStartDate}
//                     onChange={(e) => setCustomStartDate(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
//                   <input
//                     type="date"
//                     value={customEndDate}
//                     onChange={(e) => setCustomEndDate(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Profession</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Remarks</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Additional Products</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Coupon</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Cashfree ID</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredOrders.map((order, index) => (
//                   <tr
//                     key={order.id}
//                     className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//                   >
//                     <td className="px-6 py-4 text-sm">{getStatusBadge(order.payment_status)}</td>
//                     <td className="px-6 py-4 text-sm text-gray-800 font-medium">{order.full_name}</td>
//                     <td className="px-6 py-4 text-sm text-gray-600">{order.email}</td>
//                     <td className="px-6 py-4 text-sm text-gray-600">{order.phone_number}</td>
//                     <td className="px-6 py-4 text-sm text-gray-600">{order.profession}</td>
//                     <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
//                       <div className="w-48 truncate" title={order.remarks}>
//                         {order.remarks || 'No remarks'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {order.additional_products && order.additional_products.length > 0 ? (
//                         <div className="space-y-1 w-28">
//                           {order.additional_products.map((product, idx) => (
//                             <div key={idx} className="leading-tight">
//                               <div className="text-gray-800 text-xs">{product}</div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <span className="text-gray-400 text-xs">None</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-semibold text-gray-800">
//                       ₹{order.amount}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {order.coupon_code ? (
//                         <div>
//                           <span className="font-mono text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
//                             {order.coupon_code.toUpperCase()}
//                           </span>
//                           <div className="text-xs text-gray-400 mt-0.5">-₹{order.coupon_discount}</div>
//                         </div>
//                       ) : (
//                         <span className="text-gray-400 text-xs">None</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-xs font-mono text-gray-500">
//                       {order.cashfree_order_id ? (
//                         <span title={order.cashfree_order_id}>
//                           {order.cashfree_order_id.slice(0, 14)}...
//                         </span>
//                       ) : (
//                         <span className="text-gray-300">—</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
//                       {formatDateTime(order.created_at)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filteredOrders.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-4xl mb-4">✍️</div>
//               <p className="text-gray-500">
//                 {searchTerm ? 'No orders found matching your search.' : 'No orders found.'}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Stats */}
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center">
//                 <FileText className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-800">{filteredOrders.length}</p>
//                 <p className="text-sm text-gray-600">Total Records</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
//                 <CheckCircle className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-800">₹{totalRevenue}</p>
//                 <p className="text-sm text-gray-600">Revenue (Paid)</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
//                 <AlertCircle className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-800">{abandonedOrders.length}</p>
//                 <p className="text-sm text-gray-600">Abandoned Carts</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
//                 <Users className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-800">
//                   {new Set(filteredOrders.map(o => o.email)).size}
//                 </p>
//                 <p className="text-sm text-gray-600">Unique Customers</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupabaseRecord;
import React, { useState, useEffect } from 'react';
import {
  FileText, Users, CheckCircle, Download,
  Search, AlertCircle
} from 'lucide-react';
import SignatureNavbar from '../components/signature/SignatureNavbar';
import { supabase } from '../utils/supabaseClient';

const SupabaseRecord = () => {

  // 🔐 AUTH STATES
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // 📦 DATA STATES
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔍 FILTER STATES
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user && user.email === "arjun@arjun.com") {
      setShowLogin(false);
      fetchOrders();
    }
  };

  // 🔐 LOGIN
  const handleLogin = async () => {
    setAuthError("");

    if (!email || !password) {
      setAuthError("Enter email & password");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      setAuthError("Invalid credentials");
      return;
    }

    if (data.user.email !== "arjun@arjun.com") {
      setAuthError("Not authorized");
      await supabase.auth.signOut();
      return;
    }

    setShowLogin(false);
    fetchOrders();
  };

  // 🚪 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLogin(true);
  };

  // 📦 FETCH
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) setError(error.message);
      else setOrders(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 FILTER
  const filteredOrders = orders
    .filter(o => statusFilter === 'all' || o.payment_status === statusFilter)
    .filter(o =>
      o.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const paidOrders = filteredOrders.filter(o => o.payment_status === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

  // 📥 EXPORT
  const exportToCSV = () => {
    const csv = [
      ["Name", "Email", "Amount", "Status"],
      ...filteredOrders.map(o => [o.full_name, o.email, o.amount, o.payment_status])
    ];

    const blob = new Blob([csv.map(e => e.join(",")).join("\n")]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders.csv";
    link.click();
  };

  // 🔐 LOGIN UI
  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/70">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Admin Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 border rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {authError && <p className="text-red-500">{authError}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded mt-2"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-10 text-center text-black">Loading...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  // ✅ MAIN UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 text-gray-800">
      <SignatureNavbar />

      {/* Logout */}
      <div className="p-6 flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Orders Dashboard</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            placeholder="Search by name or email..."
            className="border px-4 py-2 rounded w-full max-w-md text-black"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-4 py-2 rounded text-black"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="abandoned">Abandoned</option>
          </select>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded"
          >
            <Download size={16} /> Export
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{order.full_name}</td>
                  <td className="p-4 text-gray-600">{order.email}</td>
                  <td className="p-4 font-semibold text-gray-800">₹{order.amount}</td>
                  <td className="p-4">
                    {order.payment_status === 'paid'
                      ? <span className="text-green-600 font-semibold">Paid</span>
                      : <span className="text-orange-500">{order.payment_status}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No records found
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-2xl font-bold">{filteredOrders.length}</p>
            <p className="text-gray-600">Total Orders</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-2xl font-bold">₹{totalRevenue}</p>
            <p className="text-gray-600">Revenue</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <p className="text-2xl font-bold">{paidOrders.length}</p>
            <p className="text-gray-600">Paid Orders</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SupabaseRecord;