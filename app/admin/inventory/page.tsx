'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Variant {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  product: { name: string; slug: string };
}

export default function InventoryPage() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('MANUAL');
  const [adjustNote, setAdjustNote] = useState('');

  const fetchInventory = async () => {
    const params = showLowOnly ? '?lowStock=true' : '';
    const res = await fetch(`/api/admin/inventory${params}`);
    setVariants(await res.json());
  };

  useEffect(() => { fetchInventory(); }, [showLowOnly]);

  const handleAdjust = async (variantId: string) => {
    const qty = parseInt(adjustQty);
    if (isNaN(qty) || qty === 0) return;

    await fetch('/api/admin/inventory/adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variantId,
        quantity: qty,
        reason: adjustReason,
        note: adjustNote || undefined,
      }),
    });

    setAdjusting(null);
    setAdjustQty('');
    setAdjustNote('');
    fetchInventory();
  };

  const formatPrice = (paisa: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paisa / 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-white text-3xl font-medium">Inventory</h1>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={showLowOnly} onChange={(e) => setShowLowOnly(e.target.checked)} className="accent-[#BFA06A] w-4 h-4" />
          <span className="font-montserrat text-[#F0E6C2]/70 text-sm">Low stock only</span>
        </label>
      </div>

      <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#BFA06A]/10">
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Product</th>
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">SKU</th>
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Variant</th>
              <th className="text-right px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Price</th>
              <th className="text-right px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Stock</th>
              <th className="text-right px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <>
                <tr key={v.id} className="border-b border-[#BFA06A]/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-montserrat text-[#F0E6C2] text-sm">{v.product.name}</td>
                  <td className="px-6 py-4 font-montserrat text-[#F0E6C2]/40 text-xs">{v.sku}</td>
                  <td className="px-6 py-4 font-montserrat text-[#F0E6C2]/60 text-sm">{v.name}</td>
                  <td className="px-6 py-4 text-right font-montserrat text-[#BFA06A] text-sm">{formatPrice(v.price)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-montserrat text-sm flex items-center justify-end gap-1 ${v.stock <= v.lowStockThreshold ? 'text-red-400' : v.stock <= 5 ? 'text-amber-400' : 'text-green-400'}`}>
                      {v.stock <= v.lowStockThreshold && <AlertTriangle className="w-3 h-3" />}
                      {v.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setAdjusting(adjusting === v.id ? null : v.id)}
                      className="font-montserrat text-xs text-[#BFA06A] hover:text-[#D4B580] cursor-pointer tracking-wide"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
                {adjusting === v.id && (
                  <tr key={`${v.id}-adjust`} className="border-b border-[#BFA06A]/10 bg-[#111]">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="flex items-end gap-4">
                        <div>
                          <label className="font-montserrat text-[#F0E6C2]/50 text-xs block mb-1">Qty (+/-)</label>
                          <input type="number" value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)}
                            className="bg-transparent border border-[#BFA06A]/20 text-white font-montserrat text-sm px-3 py-2 w-24 outline-none" placeholder="+10" />
                        </div>
                        <div>
                          <label className="font-montserrat text-[#F0E6C2]/50 text-xs block mb-1">Reason</label>
                          <select value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)}
                            className="bg-[#111] border border-[#BFA06A]/20 text-white font-montserrat text-sm px-3 py-2 outline-none">
                            <option value="MANUAL">Manual</option>
                            <option value="RESTOCK">Restock</option>
                            <option value="DAMAGE">Damage</option>
                            <option value="RETURN">Return</option>
                            <option value="CORRECTION">Correction</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="font-montserrat text-[#F0E6C2]/50 text-xs block mb-1">Note</label>
                          <input type="text" value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)}
                            className="bg-transparent border border-[#BFA06A]/20 text-white font-montserrat text-sm px-3 py-2 w-full outline-none" placeholder="Optional note" />
                        </div>
                        <button onClick={() => handleAdjust(v.id)}
                          className="bg-[#BFA06A] text-black font-montserrat text-xs px-4 py-2 font-semibold hover:bg-[#D4B580] cursor-pointer whitespace-nowrap">
                          Apply
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
