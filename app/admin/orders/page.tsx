'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  customer: { firstName: string; lastName: string; email: string };
  _count: { items: number };
}

const statuses = ['All', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusColors: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-400/10',
  CONFIRMED: 'text-blue-400 bg-blue-400/10',
  PROCESSING: 'text-purple-400 bg-purple-400/10',
  SHIPPED: 'text-cyan-400 bg-cyan-400/10',
  DELIVERED: 'text-green-400 bg-green-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [activeStatus, setActiveStatus] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page) });
    if (activeStatus !== 'All') params.set('status', activeStatus);
    fetch(`/api/admin/orders?${params}`)
      .then(r => r.json())
      .then(data => { setOrders(data.orders); setTotal(data.total); });
  }, [activeStatus, page]);

  const formatPrice = (paisa: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paisa / 100);

  return (
    <div>
      <h1 className="font-cormorant text-white text-3xl font-medium mb-8">Orders ({total})</h1>

      {/* Status tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => { setActiveStatus(s); setPage(1); }}
            className={`font-montserrat text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-colors cursor-pointer
              ${activeStatus === s ? 'border-[#BFA06A] text-[#BFA06A] bg-[#BFA06A]/10' : 'border-[#BFA06A]/10 text-[#F0E6C2]/50 hover:text-[#F0E6C2]'}`}
          >
            {s === 'All' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#BFA06A]/10">
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Order</th>
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Customer</th>
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Status</th>
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Payment</th>
              <th className="text-center px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Items</th>
              <th className="text-right px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Total</th>
              <th className="text-right px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center font-montserrat text-[#F0E6C2]/40 text-sm">No orders found</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="border-b border-[#BFA06A]/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/admin/orders/${o.id}`} className="font-montserrat text-[#BFA06A] text-sm hover:underline">{o.orderNumber}</Link>
                </td>
                <td className="px-6 py-4 font-montserrat text-[#F0E6C2]/70 text-sm">{o.customer.firstName} {o.customer.lastName}</td>
                <td className="px-6 py-4">
                  <span className={`font-montserrat text-[0.65rem] tracking-[0.15em] uppercase px-2 py-1 rounded ${statusColors[o.status] || ''}`}>{o.status}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-montserrat text-[0.65rem] tracking-[0.15em] uppercase px-2 py-1 rounded ${o.paymentStatus === 'PAID' ? 'text-green-400 bg-green-400/10' : 'text-amber-400 bg-amber-400/10'}`}>{o.paymentStatus}</span>
                </td>
                <td className="px-6 py-4 text-center font-montserrat text-[#F0E6C2]/60 text-sm">{o._count.items}</td>
                <td className="px-6 py-4 text-right font-montserrat text-[#BFA06A] text-sm">{formatPrice(o.totalAmount)}</td>
                <td className="px-6 py-4 text-right font-montserrat text-[#F0E6C2]/40 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
