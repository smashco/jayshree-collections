'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
  parent: { name: string } | null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', sortOrder: 0 });

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    setCategories(await res.json());
  };

  useEffect(() => { fetchCategories(); }, []);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories';
    const method = editId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm({ name: '', slug: '', sortOrder: 0 });
    setEditId(null);
    setShowForm(false);
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder });
    setEditId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products in it will lose their category.')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  const inputClass = 'w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm px-5 py-3 transition-colors';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-white text-3xl font-medium">Categories</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', slug: '', sortOrder: 0 }); }}
          className="flex items-center gap-2 bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.2em] uppercase px-5 py-3 font-semibold hover:bg-[#D4B580] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-6 rounded mb-8 flex gap-4 items-end">
          <div className="flex-1">
            <label className="font-montserrat text-[#F0E6C2]/70 text-xs tracking-[0.2em] uppercase block mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: editId ? form.slug : generateSlug(e.target.value) })}
              required
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <label className="font-montserrat text-[#F0E6C2]/70 text-xs tracking-[0.2em] uppercase block mb-2">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className={inputClass} />
          </div>
          <div className="w-32">
            <label className="font-montserrat text-[#F0E6C2]/70 text-xs tracking-[0.2em] uppercase block mb-2">Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className={inputClass} />
          </div>
          <button type="submit" className="bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.2em] uppercase px-6 py-3 font-semibold hover:bg-[#D4B580] cursor-pointer whitespace-nowrap">
            {editId ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      {/* Table */}
      <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#BFA06A]/10">
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Name</th>
              <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Slug</th>
              <th className="text-center px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Products</th>
              <th className="text-center px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Order</th>
              <th className="text-right px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-[#BFA06A]/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-montserrat text-[#F0E6C2] text-sm font-medium">{cat.name}</td>
                <td className="px-6 py-4 font-montserrat text-[#F0E6C2]/40 text-sm">{cat.slug}</td>
                <td className="px-6 py-4 text-center font-montserrat text-[#F0E6C2]/60 text-sm">{cat._count.products}</td>
                <td className="px-6 py-4 text-center font-montserrat text-[#F0E6C2]/40 text-sm">{cat.sortOrder}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(cat)} className="p-2 text-[#F0E6C2]/40 hover:text-[#BFA06A] transition-colors cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-[#F0E6C2]/40 hover:text-red-400 transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
