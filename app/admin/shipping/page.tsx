'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Truck, PackageCheck, Clock, MapPin } from 'lucide-react';

interface ShippingOrder {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  city: string;
  state: string;
  pinCode: string;
  totalAmount: number;
  itemCount: number;
  shiprocketOrderId: string | null;
  trackingNumber: string | null;
  courierName: string | null;
  shippingMethod: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

interface ShippingStats {
  pendingShipment: number;
  inTransit: number;
  delivered: number;
}

const tabs = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending Shipment' },
  { key: 'shipped', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
];

const statusColors: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-400/10',
  CONFIRMED: 'text-blue-400 bg-blue-400/10',
  PROCESSING: 'text-purple-400 bg-purple-400/10',
  SHIPPED: 'text-cyan-400 bg-cyan-400/10',
  DELIVERED: 'text-green-400 bg-green-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
};

export default function ShippingPage() {
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [stats, setStats] = useState<ShippingStats>({ pendingShipment: 0, inTransit: 0, delivered: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    const res = await fetch(`/api/admin/shipping?tab=${activeTab}`);
    if (!res.ok) return;
    const data = await res.json();
    setOrders(data.orders || []);
    setStats(data.stats || { pendingShipment: 0, inTransit: 0, delivered: 0 });
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const createShipment = async (orderId: string) => {
    setCreatingId(orderId);
    setError('');
    const res = await fetch(`/api/admin/orders/${orderId}/shipment`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      setError(`${data.error || 'Failed'}`);
    }
    setCreatingId(null);
    fetchData();
  };

  const formatPrice = (paisa: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paisa / 100);

  return (
    <div>
      <h1 className="font-cormorant text-white text-3xl font-medium mb-8">Shipping & Logistics</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-5 rounded">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-montserrat text-[#F0E6C2]/50 text-[0.65rem] tracking-[0.15em] uppercase">Pending Shipment</span>
          </div>
          <p className="font-cormorant text-white text-2xl font-medium">{stats.pendingShipment}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-5 rounded">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-cyan-400" />
            <span className="font-montserrat text-[#F0E6C2]/50 text-[0.65rem] tracking-[0.15em] uppercase">In Transit</span>
          </div>
          <p className="font-cormorant text-white text-2xl font-medium">{stats.inTransit}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-5 rounded">
          <div className="flex items-center gap-2 mb-3">
            <PackageCheck className="w-4 h-4 text-green-400" />
            <span className="font-montserrat text-[#F0E6C2]/50 text-[0.65rem] tracking-[0.15em] uppercase">Delivered</span>
          </div>
          <p className="font-cormorant text-white text-2xl font-medium">{stats.delivered}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`font-montserrat text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-colors cursor-pointer
              ${activeTab === t.key ? 'border-[#BFA06A] text-[#BFA06A] bg-[#BFA06A]/10' : 'border-[#BFA06A]/10 text-[#F0E6C2]/50 hover:text-[#F0E6C2]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-montserrat text-xs px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#BFA06A]/10">
                <th className="text-left px-5 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Order</th>
                <th className="text-left px-5 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Destination</th>
                <th className="text-left px-5 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Status</th>
                <th className="text-left px-5 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Courier</th>
                <th className="text-left px-5 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">AWB / Tracking</th>
                <th className="text-left px-5 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Method</th>
                <th className="text-right px-5 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center font-montserrat text-[#F0E6C2]/40 text-sm">
                    No orders found
                  </td>
                </tr>
              ) : orders.map(o => (
                <tr key={o.id} className="border-b border-[#BFA06A]/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${o.id}`} className="font-montserrat text-[#BFA06A] text-sm hover:underline">{o.orderNumber}</Link>
                    <p className="font-montserrat text-[#F0E6C2]/30 text-[0.6rem] mt-0.5">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                  </td>
                  <td className="px-5 py-4 font-montserrat text-[#F0E6C2]/70 text-sm">{o.customerName}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3 h-3 text-[#BFA06A]/40 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-montserrat text-[#F0E6C2]/70 text-xs">{o.city}, {o.state}</p>
                        <p className="font-montserrat text-[#F0E6C2]/30 text-[0.6rem]">{o.pinCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-montserrat text-[0.6rem] tracking-[0.15em] uppercase px-2 py-1 rounded ${statusColors[o.status] || 'text-gray-400 bg-gray-400/10'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-montserrat text-[#F0E6C2]/60 text-xs">
                    {o.courierName || <span className="text-[#F0E6C2]/20">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    {o.trackingNumber ? (
                      <span className="font-montserrat text-[#BFA06A] text-xs font-medium tracking-wide">{o.trackingNumber}</span>
                    ) : (
                      <span className="font-montserrat text-[#F0E6C2]/20 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-montserrat text-[0.6rem] tracking-[0.1em] uppercase px-2 py-1 rounded
                      ${o.shippingMethod === 'express' ? 'text-orange-400 bg-orange-400/10' : 'text-[#F0E6C2]/40 bg-[#F0E6C2]/5'}`}>
                      {o.shippingMethod}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {!o.shiprocketOrderId && !['CANCELLED', 'DELIVERED'].includes(o.status) ? (
                      <button
                        onClick={() => createShipment(o.id)}
                        disabled={creatingId === o.id}
                        className="bg-[#BFA06A]/20 border border-[#BFA06A]/40 text-[#BFA06A] font-montserrat text-[0.6rem] tracking-[0.1em] uppercase px-3 py-1.5 font-semibold hover:bg-[#BFA06A]/30 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                      >
                        {creatingId === o.id ? 'Creating...' : 'Ship Now'}
                      </button>
                    ) : o.shiprocketOrderId && o.status !== 'DELIVERED' ? (
                      <span className="font-montserrat text-cyan-400/60 text-[0.6rem] tracking-[0.1em] uppercase">In Transit</span>
                    ) : o.status === 'DELIVERED' ? (
                      <span className="font-montserrat text-green-400/60 text-[0.6rem] tracking-[0.1em] uppercase">Delivered</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
