'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

interface CustomerDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  note: string | null;
  createdAt: string;
  addresses: { id: string; address1: string; city: string; state: string; pinCode: string }[];
  orders: { id: string; orderNumber: string; status: string; totalAmount: number; createdAt: string; _count: { items: number } }[];
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);

  useEffect(() => {
    fetch(`/api/admin/customers/${id}`).then(r => r.json()).then(setCustomer);
  }, [id]);

  const formatPrice = (paisa: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paisa / 100);

  if (!customer) return <div className="text-[#F0E6C2]/40 font-montserrat text-sm">Loading...</div>;

  return (
    <div>
      <h1 className="font-cormorant text-white text-3xl font-medium mb-8">{customer.firstName} {customer.lastName}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded p-6">
          <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium mb-4">Contact</h3>
          <div className="space-y-2 font-montserrat text-sm text-[#F0E6C2]/70">
            <p>{customer.email}</p>
            <p>{customer.phone || 'No phone'}</p>
            <p className="text-[#F0E6C2]/40 text-xs">Since {new Date(customer.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#0A0A0A] border border-[#BFA06A]/10 rounded p-6">
          <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium mb-4">Orders ({customer.orders.length})</h3>
          {customer.orders.length === 0 ? (
            <p className="font-montserrat text-[#F0E6C2]/40 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {customer.orders.map((o) => (
                <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between border border-[#BFA06A]/5 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <div>
                    <p className="font-montserrat text-[#BFA06A] text-sm">{o.orderNumber}</p>
                    <p className="font-montserrat text-[#F0E6C2]/40 text-xs">{o._count.items} items | {new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-montserrat text-[#BFA06A] text-sm">{formatPrice(o.totalAmount)}</p>
                    <p className="font-montserrat text-[#F0E6C2]/40 text-[0.6rem] tracking-[0.15em] uppercase">{o.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
