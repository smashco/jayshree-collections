'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  IndianRupee,
  FolderTree,
} from 'lucide-react';

interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockVariants: number;
  totalRevenue: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    customerName: string;
    createdAt: string;
  }[];
}

const statusColors: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-400/10',
  CONFIRMED: 'text-blue-400 bg-blue-400/10',
  PROCESSING: 'text-purple-400 bg-purple-400/10',
  SHIPPED: 'text-cyan-400 bg-cyan-400/10',
  DELIVERED: 'text-green-400 bg-green-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  REFUNDED: 'text-gray-400 bg-gray-400/10',
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const formatPrice = (paisa: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paisa / 100);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-montserrat text-[#F0E6C2]/40 text-sm tracking-widest uppercase">Loading...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: formatPrice(data.totalRevenue), icon: IndianRupee, color: 'text-green-400' },
    { label: 'Products', value: data.totalProducts, icon: Package, color: 'text-[#BFA06A]' },
    { label: 'Categories', value: data.totalCategories, icon: FolderTree, color: 'text-blue-400' },
    { label: 'Orders', value: data.totalOrders, icon: ShoppingCart, color: 'text-purple-400' },
    { label: 'Customers', value: data.totalCustomers, icon: Users, color: 'text-cyan-400' },
    { label: 'Low Stock', value: data.lowStockVariants, icon: AlertTriangle, color: data.lowStockVariants > 0 ? 'text-red-400' : 'text-green-400' },
  ];

  return (
    <div>
      <h1 className="font-cormorant text-white text-3xl font-medium mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-5 rounded"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="font-montserrat text-[#F0E6C2]/50 text-[0.65rem] tracking-[0.15em] uppercase">
                  {stat.label}
                </span>
              </div>
              <p className="font-cormorant text-white text-2xl font-medium">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded">
        <div className="px-6 py-4 border-b border-[#BFA06A]/10">
          <h2 className="font-montserrat text-[#F0E6C2] text-sm tracking-[0.2em] uppercase font-medium">
            Recent Orders
          </h2>
        </div>
        {data.recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-montserrat text-[#F0E6C2]/40 text-sm">No orders yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#BFA06A]/10">
                <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Order</th>
                <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Customer</th>
                <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Status</th>
                <th className="text-right px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#BFA06A]/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-montserrat text-[#F0E6C2] text-sm">{order.orderNumber}</td>
                  <td className="px-6 py-4 font-montserrat text-[#F0E6C2]/70 text-sm">{order.customerName}</td>
                  <td className="px-6 py-4">
                    <span className={`font-montserrat text-[0.65rem] tracking-[0.15em] uppercase px-2 py-1 rounded ${statusColors[order.status] || 'text-gray-400'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-montserrat text-[#BFA06A] text-sm">{formatPrice(order.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
