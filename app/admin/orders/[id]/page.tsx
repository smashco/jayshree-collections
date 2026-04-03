'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  note: string | null;
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  customer: { firstName: string; lastName: string; email: string; phone: string | null };
  shippingAddress: { firstName: string; lastName: string; address1: string; address2: string | null; city: string; state: string; pinCode: string };
  items: { id: string; name: string; sku: string; quantity: number; unitPrice: number; product: { slug: string; images: { url: string }[] } }[];
}

const statusFlow = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);

  const fetchOrder = async () => {
    const res = await fetch(`/api/admin/orders/${id}`);
    setOrder(await res.json());
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const updateStatus = async (status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrder();
  };

  const formatPrice = (paisa: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paisa / 100);

  if (!order) return <div className="text-[#F0E6C2]/40 font-montserrat text-sm">Loading...</div>;

  const currentIdx = statusFlow.indexOf(order.status);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cormorant text-white text-3xl font-medium">Order {order.orderNumber}</h1>
          <p className="font-montserrat text-[#F0E6C2]/40 text-xs mt-1">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <div className="flex gap-2">
          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
            <>
              {currentIdx < statusFlow.length - 1 && (
                <button
                  onClick={() => updateStatus(statusFlow[currentIdx + 1])}
                  className="bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.15em] uppercase px-4 py-2 font-semibold hover:bg-[#D4B580] cursor-pointer"
                >
                  Move to {statusFlow[currentIdx + 1]}
                </button>
              )}
              <button
                onClick={() => { if (confirm('Cancel this order? Stock will be restocked.')) updateStatus('CANCELLED'); }}
                className="border border-red-400/30 text-red-400 font-montserrat text-xs tracking-[0.15em] uppercase px-4 py-2 hover:bg-red-400/10 cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {statusFlow.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
              ${i <= currentIdx ? 'bg-[#BFA06A] text-black' : 'bg-[#222] text-[#F0E6C2]/30'}`}>
              {i + 1}
            </div>
            <span className={`font-montserrat text-[0.6rem] tracking-[0.15em] uppercase whitespace-nowrap
              ${i <= currentIdx ? 'text-[#BFA06A]' : 'text-[#F0E6C2]/30'}`}>
              {s}
            </span>
            {i < statusFlow.length - 1 && <div className={`w-8 h-px ${i < currentIdx ? 'bg-[#BFA06A]' : 'bg-[#333]'}`} />}
          </div>
        ))}
        {order.status === 'CANCELLED' && (
          <span className="font-montserrat text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded ml-2">CANCELLED</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-[#BFA06A]/10 rounded p-6">
          <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium mb-4">Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-[#BFA06A]/5 pb-4">
                <div className="relative w-14 h-16 bg-[#111] border border-[#BFA06A]/10 shrink-0">
                  {item.product.images[0] && <Image src={item.product.images[0].url} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="font-montserrat text-[#F0E6C2] text-sm">{item.name}</p>
                  <p className="font-montserrat text-[#F0E6C2]/40 text-xs">SKU: {item.sku} | Qty: {item.quantity}</p>
                </div>
                <p className="font-montserrat text-[#BFA06A] text-sm">{formatPrice(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-[#BFA06A]/10 pt-4">
            <div className="flex justify-between font-montserrat text-sm text-[#F0E6C2]/60"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between font-montserrat text-sm text-[#F0E6C2]/60"><span>Tax</span><span>{formatPrice(order.taxAmount)}</span></div>
            <div className="flex justify-between font-montserrat text-sm text-[#F0E6C2]/60"><span>Shipping</span><span>{order.shippingAmount === 0 ? 'Free' : formatPrice(order.shippingAmount)}</span></div>
            <div className="flex justify-between font-montserrat text-base text-[#BFA06A] font-medium border-t border-[#BFA06A]/10 pt-2"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>
          </div>
        </div>

        {/* Customer & Address */}
        <div className="space-y-6">
          <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded p-6">
            <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium mb-4">Customer</h3>
            <p className="font-montserrat text-[#F0E6C2] text-sm">{order.customer.firstName} {order.customer.lastName}</p>
            <p className="font-montserrat text-[#F0E6C2]/50 text-xs mt-1">{order.customer.email}</p>
            {order.customer.phone && <p className="font-montserrat text-[#F0E6C2]/50 text-xs mt-1">{order.customer.phone}</p>}
          </div>

          <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded p-6">
            <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium mb-4">Shipping Address</h3>
            <div className="font-montserrat text-[#F0E6C2]/70 text-sm space-y-1">
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pinCode}</p>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded p-6">
            <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium mb-4">Payment</h3>
            <p className={`font-montserrat text-sm ${order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-amber-400'}`}>{order.paymentStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
