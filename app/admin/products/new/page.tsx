'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    material: '',
    basePrice: '',
    categoryId: '',
    isFeatured: false,
  });

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories);
  }, []);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        basePrice: Math.round(parseFloat(form.basePrice) * 100),
      }),
    });

    if (res.ok) {
      const product = await res.json();
      router.push(`/admin/products/${product.id}`);
    } else {
      alert('Failed to create product');
    }
    setLoading(false);
  };

  const inputClass = 'w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm px-5 py-3 transition-colors';
  const labelClass = 'font-montserrat text-[#F0E6C2]/70 text-xs tracking-[0.2em] uppercase block mb-2';

  return (
    <div>
      <h1 className="font-cormorant text-white text-3xl font-medium mb-8">New Product</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 bg-[#0A0A0A] border border-[#BFA06A]/10 p-8 rounded">
        <div>
          <label className={labelClass}>Product Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Category *</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
            className={inputClass + ' bg-[#0A0A0A]'}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Base Price (INR) *</label>
          <input
            type="number"
            value={form.basePrice}
            onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
            required
            min="0"
            step="0.01"
            className={inputClass}
            placeholder="e.g. 245000"
          />
        </div>

        <div>
          <label className={labelClass}>Material</label>
          <input
            type="text"
            value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })}
            className={inputClass}
            placeholder="e.g. 22k Gold • Uncut Diamonds"
          />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className={inputClass + ' resize-none'}
          />
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="accent-[#BFA06A] w-4 h-4"
            />
            <span className="font-montserrat text-[#F0E6C2]/70 text-sm">Featured Product</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#BFA06A] text-black font-montserrat text-sm tracking-[0.2em] uppercase px-8 py-3 font-semibold hover:bg-[#D4B580] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
