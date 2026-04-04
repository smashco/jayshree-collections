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
  images: { id: string; url: string; alt: string | null; isPrimary: boolean; mediaType: string }[];
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

  const [uploading, setUploading] = useState(false);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !product) return;
    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productSlug', product.slug);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) continue;

      const { url, mediaType } = await res.json();

      await fetch(`/api/admin/products/${id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          alt: product.name,
          mediaType,
          isPrimary: mediaType === 'image' && product.images.filter(i => i.mediaType === 'image').length === 0,
        }),
      });
    }

    const updated = await fetch(`/api/admin/products/${id}`).then(r => r.json());
    setProduct(updated);
    setUploading(false);
    e.target.value = '';
  };

  const handleDeleteMedia = async (imageId: string) => {
    if (!confirm('Delete this media?')) return;
    await fetch(`/api/admin/products/${id}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId }),
    });
    const updated = await fetch(`/api/admin/products/${id}`).then(r => r.json());
    setProduct(updated);
  };

  const handleSetPrimary = async (imageId: string) => {
    await fetch(`/api/admin/products/${id}/images/${imageId}/primary`, { method: 'POST' });
    const updated = await fetch(`/api/admin/products/${id}`).then(r => r.json());
    setProduct(updated);
  };

  const handleStockUpdate = async (variantId: string, newStock: number) => {
    await fetch(`/api/admin/products/${id}/variants/${variantId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: newStock }),
    });
    setProduct(prev => prev ? {
      ...prev,
      variants: prev.variants.map(v => v.id === variantId ? { ...v, stock: newStock } : v),
    } : prev);
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

        {/* Sidebar: Media */}
        <div className="space-y-8">
          <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-6 rounded">
            <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium mb-4">
              Media ({product.images.length})
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {product.images.map((media) => (
                <div key={media.id} className="relative aspect-[4/5] bg-[#111] border border-[#BFA06A]/10 group">
                  {media.mediaType === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover" muted playsInline loop
                      onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play()}
                      onMouseLeave={e => { (e.currentTarget as HTMLVideoElement).pause(); (e.currentTarget as HTMLVideoElement).currentTime = 0; }}
                    />
                  ) : (
                    <Image src={media.url} alt={media.alt || ''} fill className="object-cover" />
                  )}
                  {media.isPrimary && (
                    <span className="absolute top-1 left-1 bg-[#BFA06A] text-black text-[0.5rem] font-bold px-1.5 py-0.5 uppercase tracking-wider">Primary</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {media.mediaType === 'image' && !media.isPrimary && (
                      <button onClick={() => handleSetPrimary(media.id)}
                        className="text-[0.55rem] font-montserrat tracking-widest uppercase text-[#BFA06A] border border-[#BFA06A]/50 px-2 py-1 hover:bg-[#BFA06A]/10 cursor-pointer">
                        Set Primary
                      </button>
                    )}
                    <button onClick={() => handleDeleteMedia(media.id)}
                      className="text-red-400 hover:text-red-300 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <label className={`flex items-center gap-2 justify-center border border-dashed border-[#BFA06A]/30 py-4 cursor-pointer hover:border-[#BFA06A] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="w-4 h-4 text-[#BFA06A]" />
              <span className="font-montserrat text-[#BFA06A] text-xs tracking-[0.15em] uppercase">
                {uploading ? 'Uploading...' : 'Upload Photos & Videos'}
              </span>
              <input type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} className="hidden" />
            </label>
            <p className="font-montserrat text-[#F0E6C2]/30 text-[0.6rem] text-center mt-2">Select multiple files at once · Photos up to 10MB · Videos up to 100MB</p>
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
                <div key={v.id} className="border border-[#BFA06A]/10 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-montserrat text-[#F0E6C2] text-sm">{v.name}</p>
                      <p className="font-montserrat text-[#F0E6C2]/40 text-xs">SKU: {v.sku}</p>
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
                  <div className="flex items-center gap-2">
                    <label className="font-montserrat text-[#F0E6C2]/50 text-xs tracking-widest uppercase">Stock:</label>
                    <input
                      type="number"
                      min={0}
                      defaultValue={v.stock}
                      onBlur={(e) => handleStockUpdate(v.id, parseInt(e.target.value) || 0)}
                      className="w-20 bg-[#111] border border-[#BFA06A]/20 text-[#F0E6C2] font-montserrat text-sm px-2 py-1 focus:border-[#BFA06A] outline-none"
                    />
                    <span className={`font-montserrat text-xs ${v.stock === 0 ? 'text-red-400' : v.stock <= 5 ? 'text-amber-400' : 'text-green-400/70'}`}>
                      {v.stock === 0 ? 'Out of stock' : v.stock <= 5 ? 'Low stock' : 'In stock'}
                    </span>
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
