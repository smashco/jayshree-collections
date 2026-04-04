'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Upload } from 'lucide-react';

interface ProductData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  material: string | null;
  basePrice: number;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  category: { id: string; name: string };
  images: { id: string; url: string; alt: string | null; isPrimary: boolean }[];
  variants: {
    id: string; sku: string; name: string; size: string | null;
    weight: string | null; purity: string | null; price: number;
    stock: number; lowStockThreshold: number; isActive: boolean;
  }[];
}

interface Category { id: string; name: string; }

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', material: '', basePrice: '', categoryId: '', isFeatured: false, isActive: true });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then(r => r.json()),
      fetch('/api/admin/categories').then(r => r.json()),
    ]).then(([prod, cats]) => {
      setProduct(prod);
      setCategories(cats);
      setForm({
        name: prod.name, slug: prod.slug,
        description: prod.description || '', material: prod.material || '',
        basePrice: String(prod.basePrice / 100), categoryId: prod.categoryId,
        isFeatured: prod.isFeatured, isActive: prod.isActive,
      });
    });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        basePrice: Math.round(parseFloat(form.basePrice) * 100),
      }),
    });
    setSaving(false);
    alert('Product saved!');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('productSlug', product.slug);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) { alert('Upload failed'); return; }

    const { url } = await res.json();

    // Save image record to database
    await fetch(`/api/admin/products/${id}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        alt: product.name,
        isPrimary: product.images.length === 0,
      }),
    });

    const updated = await fetch(`/api/admin/products/${id}`).then(r => r.json());
    setProduct(updated);
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Delete this variant?')) return;
    await fetch(`/api/admin/products/${id}/variants/${variantId}`, { method: 'DELETE' });
    const updated = await fetch(`/api/admin/products/${id}`).then(r => r.json());
    setProduct(updated);
  };

  const handleAddVariant = async () => {
    const sku = prompt('Enter SKU:');
    const name = prompt('Enter variant name:');
    const price = prompt('Enter price (INR):');
    if (!sku || !name || !price) return;

    await fetch(`/api/admin/products/${id}/variants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, name, price: Math.round(parseFloat(price) * 100), stock: 0 }),
    });
    const updated = await fetch(`/api/admin/products/${id}`).then(r => r.json());
    setProduct(updated);
  };

  if (!product) {
    return <div className="text-[#F0E6C2]/40 font-montserrat text-sm">Loading...</div>;
  }

  const inputClass = 'w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm px-5 py-3 transition-colors';
  const labelClass = 'font-montserrat text-[#F0E6C2]/70 text-xs tracking-[0.2em] uppercase block mb-2';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-white text-3xl font-medium">Edit Product</h1>
        <button onClick={handleSave} disabled={saving}
          className="bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.2em] uppercase px-6 py-3 font-semibold hover:bg-[#D4B580] disabled:opacity-50 cursor-pointer">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6 bg-[#0A0A0A] border border-[#BFA06A]/10 p-8 rounded">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={inputClass + ' resize-none'} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Material</label>
              <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Base Price (INR)</label>
              <input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass + ' bg-[#0A0A0A]'}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-6 pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-[#BFA06A] w-4 h-4" />
                <span className="font-montserrat text-[#F0E6C2]/70 text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-[#BFA06A] w-4 h-4" />
                <span className="font-montserrat text-[#F0E6C2]/70 text-sm">Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar: Images */}
        <div className="space-y-8">
          <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-6 rounded">
            <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium mb-4">Images</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {product.images.map((img) => (
                <div key={img.id} className="relative aspect-[4/5] bg-[#111] border border-[#BFA06A]/10">
                  <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 justify-center border border-dashed border-[#BFA06A]/30 py-4 cursor-pointer hover:border-[#BFA06A] transition-colors">
              <Upload className="w-4 h-4 text-[#BFA06A]" />
              <span className="font-montserrat text-[#BFA06A] text-xs tracking-[0.15em] uppercase">Upload Image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Variants */}
          <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-6 rounded">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium">Variants</h3>
              <button onClick={handleAddVariant} className="text-[#BFA06A] hover:text-[#D4B580] cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {product.variants.map((v) => (
                <div key={v.id} className="flex items-center justify-between border border-[#BFA06A]/10 px-4 py-3">
                  <div>
                    <p className="font-montserrat text-[#F0E6C2] text-sm">{v.name}</p>
                    <p className="font-montserrat text-[#F0E6C2]/40 text-xs">SKU: {v.sku} | Stock: {v.stock}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-montserrat text-[#BFA06A] text-sm">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v.price / 100)}
                    </span>
                    <button onClick={() => handleDeleteVariant(v.id)} className="text-[#F0E6C2]/30 hover:text-red-400 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
