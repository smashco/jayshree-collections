'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

interface TrackingData {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  customerName: string;
  destination: string;
  shippingMethod: string;
  trackingNumber: string | null;
  courierName: string | null;
  totalAmount: number;
  items: { name: string; quantity: number; unitPrice: number }[];
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  timeline: { status: string; label: string; date: string | null; active: boolean }[];
}

const statusStyles: Record<string, { color: string; bg: string; label: string }> = {
  PENDING: { color: 'text-amber-400', bg: 'bg-amber-400', label: 'Pending' },
  CONFIRMED: { color: 'text-blue-400', bg: 'bg-blue-400', label: 'Confirmed' },
  PROCESSING: { color: 'text-purple-400', bg: 'bg-purple-400', label: 'Preparing' },
  SHIPPED: { color: 'text-cyan-400', bg: 'bg-cyan-400', label: 'Shipped' },
  DELIVERED: { color: 'text-green-400', bg: 'bg-green-400', label: 'Delivered' },
  CANCELLED: { color: 'text-red-400', bg: 'bg-red-400', label: 'Cancelled' },
};

function TrackContent() {
  const params = useSearchParams();
  const prefilledOrder = params.get('order') || '';
  const prefilledEmail = params.get('email') || '';
  const [orderInput, setOrderInput] = useState(prefilledOrder);
  const [emailInput, setEmailInput] = useState(prefilledEmail);
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (orderNum: string, email: string) => {
    if (!orderNum.trim() || !email.trim()) return;
    setLoading(true);
    setError('');
    setData(null);

    const res = await fetch(`/api/track?order=${encodeURIComponent(orderNum.trim())}&email=${encodeURIComponent(email.trim())}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Something went wrong' }));
      setError(err.error || 'Order not found');
    } else {
      setData(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (prefilledOrder && prefilledEmail) fetchTracking(prefilledOrder, prefilledEmail);
  }, [prefilledOrder, prefilledEmail]);

  const formatPrice = (paisa: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paisa / 100);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const style = data ? statusStyles[data.status] || statusStyles.PENDING : null;

  return (
    <section className="flex-1 pt-32 pb-20 md:pt-48 md:pb-32 relative z-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12">
          <p className="font-montserrat text-[#BFA06A] text-[0.6rem] tracking-[0.6em] uppercase mb-4">Order Tracking</p>
          <h1 className="font-cormorant text-white font-light leading-none mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Track Your <em className="text-[#BFA06A]">Order</em>
          </h1>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12">
          <form onSubmit={(e) => { e.preventDefault(); fetchTracking(orderInput, emailInput); }} className="flex flex-col gap-3">
            <input
              type="text"
              value={orderInput}
              onChange={e => setOrderInput(e.target.value)}
              placeholder="Order number (e.g. JC-20260407-AB12)"
              className="bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm px-5 py-4 transition-colors placeholder:text-[#F0E6C2]/30"
            />
            <div className="flex gap-3">
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="Email used at checkout"
                className="flex-1 bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm px-5 py-4 transition-colors placeholder:text-[#F0E6C2]/30"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.25em] uppercase px-8 py-4 font-bold hover:bg-[#D4B580] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </div>
          </form>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="border border-red-500/20 bg-red-500/5 text-red-400 font-montserrat text-sm px-6 py-4 text-center mb-8">
            {error}
          </motion.div>
        )}

        {/* Results */}
        {data && style && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

            {/* Status Banner */}
            <div className="border border-[#BFA06A]/15 p-8 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="font-montserrat text-[#F0E6C2]/50 text-[0.6rem] tracking-[0.3em] uppercase mb-1">Order</p>
                  <p className="font-cormorant text-[#BFA06A] text-2xl font-medium">{data.orderNumber}</p>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded ${style.color} ${style.bg}/10`}>
                  <div className={`w-2 h-2 rounded-full ${style.bg}`} />
                  <span className="font-montserrat text-xs tracking-[0.2em] uppercase font-medium">{style.label}</span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="font-montserrat text-[#F0E6C2]/40 text-[0.55rem] tracking-[0.25em] uppercase mb-1">Customer</p>
                  <p className="font-montserrat text-[#F0E6C2] text-sm">{data.customerName}</p>
                </div>
                <div>
                  <p className="font-montserrat text-[#F0E6C2]/40 text-[0.55rem] tracking-[0.25em] uppercase mb-1">Destination</p>
                  <p className="font-montserrat text-[#F0E6C2] text-sm">{data.destination}</p>
                </div>
                <div>
                  <p className="font-montserrat text-[#F0E6C2]/40 text-[0.55rem] tracking-[0.25em] uppercase mb-1">Method</p>
                  <p className="font-montserrat text-[#F0E6C2] text-sm capitalize">{data.shippingMethod === 'express' ? 'Express (1–2 days)' : 'Standard (5–7 days)'}</p>
                </div>
                <div>
                  <p className="font-montserrat text-[#F0E6C2]/40 text-[0.55rem] tracking-[0.25em] uppercase mb-1">Order Date</p>
                  <p className="font-montserrat text-[#F0E6C2] text-sm">{formatDate(data.createdAt)}</p>
                </div>
                {data.courierName && (
                  <div>
                    <p className="font-montserrat text-[#F0E6C2]/40 text-[0.55rem] tracking-[0.25em] uppercase mb-1">Courier</p>
                    <p className="font-montserrat text-[#F0E6C2] text-sm">{data.courierName}</p>
                  </div>
                )}
                {data.trackingNumber && (
                  <div>
                    <p className="font-montserrat text-[#F0E6C2]/40 text-[0.55rem] tracking-[0.25em] uppercase mb-1">AWB / Tracking</p>
                    <p className="font-montserrat text-[#BFA06A] text-sm font-medium">{data.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            {data.status !== 'CANCELLED' && (
              <div className="border border-[#BFA06A]/15 p-8 mb-8">
                <p className="font-montserrat text-[#BFA06A]/80 text-[0.6rem] tracking-[0.5em] uppercase mb-8 text-center">Delivery Progress</p>
                <div className="space-y-0">
                  {data.timeline.map((step, i) => {
                    const isLast = i === data.timeline.length - 1;
                    const stepStyle = step.active ? statusStyles[step.status] || statusStyles.CONFIRMED : null;
                    return (
                      <div key={step.status} className="flex gap-4">
                        {/* Vertical line + dot */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                            ${step.active ? 'bg-[#BFA06A] text-black' : 'bg-[#1a1a1a] text-[#F0E6C2]/30'}`}>
                            {i + 1}
                          </div>
                          {!isLast && (
                            <div className={`w-px h-12 ${step.active ? 'bg-[#BFA06A]/50' : 'bg-[#222]'}`} />
                          )}
                        </div>
                        {/* Content */}
                        <div className="pt-1 pb-6">
                          <p className={`font-montserrat text-sm font-medium ${step.active ? 'text-[#F0E6C2]' : 'text-[#F0E6C2]/30'}`}>
                            {step.label}
                          </p>
                          {step.date && (
                            <p className="font-montserrat text-[#F0E6C2]/40 text-xs mt-1">{formatDateTime(step.date)}</p>
                          )}
                          {step.status === 'SHIPPED' && data.trackingNumber && step.active && (
                            <p className="font-montserrat text-[#BFA06A] text-xs mt-1">
                              AWB: {data.trackingNumber} via {data.courierName}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {data.status === 'CANCELLED' && (
              <div className="border border-red-500/20 bg-red-500/5 p-8 mb-8 text-center">
                <p className="font-montserrat text-red-400 text-sm mb-2">This order was cancelled</p>
                {data.cancelledAt && (
                  <p className="font-montserrat text-red-400/60 text-xs">{formatDateTime(data.cancelledAt)}</p>
                )}
              </div>
            )}

            {/* Items */}
            <div className="border border-[#BFA06A]/15 p-8 mb-8">
              <p className="font-montserrat text-[#BFA06A]/80 text-[0.6rem] tracking-[0.5em] uppercase mb-6 text-center">Order Items</p>
              <div className="space-y-4">
                {data.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-[#BFA06A]/10 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-montserrat text-[#F0E6C2] text-sm">{item.name}</p>
                      <p className="font-montserrat text-[#F0E6C2]/40 text-xs mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-montserrat text-[#BFA06A] text-sm">{formatPrice(item.unitPrice * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t border-[#BFA06A]/20 pt-4 mt-4">
                <span className="font-montserrat text-[#F0E6C2] text-sm font-bold tracking-widest uppercase">Total</span>
                <span className="font-montserrat text-[#BFA06A] text-base font-bold">{formatPrice(data.totalAmount)}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center">
              <Link href="/shop" className="btn-gold inline-flex items-center justify-center px-8 py-4">
                <span>Continue Shopping</span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!data && !error && !loading && (
          <div className="text-center py-16">
            <p className="font-montserrat text-[#F0E6C2]/30 text-sm mb-2">Enter your order number above to track your shipment.</p>
            <p className="font-montserrat text-[#F0E6C2]/20 text-xs">Your order number was sent to your email when you placed the order.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[#F0E6C2]/40 font-montserrat text-sm">Loading...</div>}>
        <TrackContent />
      </Suspense>
      <Footer />
    </main>
  );
}
