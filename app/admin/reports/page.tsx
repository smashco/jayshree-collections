'use client';

import { useEffect, useState } from 'react';
import { IndianRupee, ShoppingCart, TrendingUp } from 'lucide-react';

interface SalesData {
  summary: { totalRevenue: number; totalOrders: number; averageOrderValue: number; period: string };
  daily: { date: string; revenue: number; orders: number }[];
}

interface TopProduct {
  productId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}

export default function ReportsPage() {
  const [sales, setSales] = useState<SalesData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/admin/reports/sales?days=${days}`).then(r => r.json()).then(setSales);
    fetch('/api/admin/reports/top-products').then(r => r.json()).then(setTopProducts);
  }, [days]);

  const formatPrice = (paisa: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paisa / 100);

  if (!sales) return <div className="text-[#F0E6C2]/40 font-montserrat text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-white text-3xl font-medium">Reports</h1>
        <div className="flex gap-2">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`font-montserrat text-xs px-4 py-2 border cursor-pointer transition-colors
                ${days === d ? 'border-[#BFA06A] text-[#BFA06A] bg-[#BFA06A]/10' : 'border-[#BFA06A]/10 text-[#F0E6C2]/50'}`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-6 rounded">
          <div className="flex items-center gap-2 mb-3">
            <IndianRupee className="w-4 h-4 text-green-400" />
            <span className="font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase">Revenue</span>
          </div>
          <p className="font-cormorant text-white text-3xl font-medium">{formatPrice(sales.summary.totalRevenue)}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-6 rounded">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="w-4 h-4 text-purple-400" />
            <span className="font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase">Orders</span>
          </div>
          <p className="font-cormorant text-white text-3xl font-medium">{sales.summary.totalOrders}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-6 rounded">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#BFA06A]" />
            <span className="font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase">Avg. Order</span>
          </div>
          <p className="font-cormorant text-white text-3xl font-medium">{formatPrice(sales.summary.averageOrderValue)}</p>
        </div>
      </div>

      {/* Daily breakdown */}
      {sales.daily.length > 0 && (
        <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded p-6 mb-8">
          <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium mb-4">Daily Sales</h3>
          <div className="space-y-2">
            {sales.daily.map((d) => (
              <div key={d.date} className="flex items-center justify-between border-b border-[#BFA06A]/5 pb-2">
                <span className="font-montserrat text-[#F0E6C2]/60 text-sm">{d.date}</span>
                <div className="flex items-center gap-6">
                  <span className="font-montserrat text-[#F0E6C2]/40 text-xs">{d.orders} orders</span>
                  <span className="font-montserrat text-[#BFA06A] text-sm">{formatPrice(d.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Products */}
      <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded p-6">
        <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium mb-4">Top Products</h3>
        {topProducts.length === 0 ? (
          <p className="font-montserrat text-[#F0E6C2]/40 text-sm">No sales data yet</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.productId} className="flex items-center justify-between border-b border-[#BFA06A]/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-montserrat text-[#BFA06A] text-sm font-bold w-6">#{i + 1}</span>
                  <span className="font-montserrat text-[#F0E6C2] text-sm">{p.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-montserrat text-[#F0E6C2]/40 text-xs">{p.totalQuantity} sold</span>
                  <span className="font-montserrat text-[#BFA06A] text-sm">{formatPrice(p.totalRevenue)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
