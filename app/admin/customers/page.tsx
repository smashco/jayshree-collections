'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  createdAt: string;
  _count: { orders: number };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    fetch(`/api/admin/customers?${params}`)
      .then(r => r.json())
      .then(data => { setCustomers(data.customers); setTotal(data.total); });
  }, [search]);

  return (
    <div>
      <h1 className="font-cormorant text-white text-3xl font-medium mb-8">Customers ({total})</h1>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F0E6C2]/40" />
        <input
          type="text" placeholder="Search customers..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0A0A0A] border border-[#BFA06A]/10 text-white font-montserrat text-sm pl-11 pr-4 py-3 outline-none focus:border-[#BFA06A]/30"
        />
      </div>

      <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#BFA06A]/10">
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Name</th>
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Email</th>
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Phone</th>
              <th className="text-center px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Orders</th>
              <th className="text-right px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center font-montserrat text-[#F0E6C2]/40 text-sm">No customers found</td></tr>
            ) : customers.map((c) => (
              <tr key={c.id} className="border-b border-[#BFA06A]/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <Link href={`/admin/customers/${c.id}`} className="font-montserrat text-[#F0E6C2] text-sm hover:text-[#BFA06A]">{c.firstName} {c.lastName}</Link>
                </td>
                <td className="px-6 py-4 font-montserrat text-[#F0E6C2]/60 text-sm">{c.email}</td>
                <td className="px-6 py-4 font-montserrat text-[#F0E6C2]/40 text-sm">{c.phone || '-'}</td>
                <td className="px-6 py-4 text-center font-montserrat text-[#F0E6C2]/60 text-sm">{c._count.orders}</td>
                <td className="px-6 py-4 text-right font-montserrat text-[#F0E6C2]/40 text-xs">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
