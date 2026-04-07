'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string };
  images: { url: string }[];
  variants: { id: string; stock: number; price: number }[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.products);
    setTotal(data.total);
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const formatPrice = (paisa: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paisa / 100);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const totalStock = (variants: { stock: number }[]) =>
    variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-white text-3xl font-medium">Products ({total})</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/products/bulk-upload"
            className="flex items-center gap-2 bg-[#BFA06A]/20 border border-[#BFA06A]/40 text-[#BFA06A] font-montserrat text-xs tracking-[0.15em] uppercase px-4 py-3 font-semibold hover:bg-[#BFA06A]/30 transition-colors"
          >
            Bulk Upload
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.2em] uppercase px-5 py-3 font-semibold hover:bg-[#D4B580] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F0E6C2]/40" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full bg-[#0A0A0A] border border-[#BFA06A]/10 text-white font-montserrat text-sm pl-11 pr-4 py-3 outline-none focus:border-[#BFA06A]/30 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#BFA06A]/10">
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Product</th>
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Category</th>
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Status</th>
              <th className="text-right px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Price</th>
              <th className="text-right px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Stock</th>
              <th className="text-right px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[#BFA06A]/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-14 bg-[#111] border border-[#BFA06A]/10 shrink-0">
                      {p.images[0] && <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />}
                    </div>
                    <div>
                      <p className="font-montserrat text-[#F0E6C2] text-sm font-medium">{p.name}</p>
                      <p className="font-montserrat text-[#F0E6C2]/40 text-xs">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-montserrat text-[#F0E6C2]/60 text-sm">{p.category.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="font-montserrat text-xs text-[#F0E6C2]/60">
                      {p.isActive ? 'Active' : 'Draft'}
                    </span>
                    {p.isFeatured && (
                      <span className="font-montserrat text-[0.6rem] text-[#BFA06A] bg-[#BFA06A]/10 px-1.5 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-montserrat text-[#BFA06A] text-sm">
                  {formatPrice(p.basePrice)}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-montserrat text-sm ${totalStock(p.variants) <= 2 ? 'text-red-400' : 'text-[#F0E6C2]/60'}`}>
                    {totalStock(p.variants)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="p-2 text-[#F0E6C2]/40 hover:text-[#BFA06A] transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-[#F0E6C2]/40 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="font-montserrat text-xs text-[#F0E6C2]/60 hover:text-[#BFA06A] disabled:opacity-30 cursor-pointer"
          >
            Previous
          </button>
          <span className="font-montserrat text-xs text-[#F0E6C2]/40">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={products.length < 20}
            className="font-montserrat text-xs text-[#F0E6C2]/60 hover:text-[#BFA06A] disabled:opacity-30 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
