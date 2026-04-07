'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, FolderTree } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  parentId: string | null;
  _count: { products: number };
  parent: { id: string; name: string } | null;
  children?: Category[];
}

export default function CategoriesPage() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', sortOrder: 0, parentId: '' });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setAllCategories(data);
    // Auto-expand all on first load
    const ids = new Set<string>();
    data.forEach((c: Category) => { if (c.children && c.children.length > 0) ids.add(c.id); });
    setExpanded(ids);
  };

  useEffect(() => { fetchCategories(); }, []);

  // Only root categories (no parent)
  const rootCategories = allCategories.filter(c => !c.parentId);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories';
    const method = editId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        sortOrder: form.sortOrder,
        parentId: form.parentId || null,
      }),
    });

    setForm({ name: '', slug: '', sortOrder: 0, parentId: '' });
    setEditId(null);
    setShowForm(false);
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder, parentId: cat.parentId || '' });
    setEditId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category and all its sub-categories?')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  const handleAddSubCategory = (parentId: string) => {
    setForm({ name: '', slug: '', sortOrder: 0, parentId });
    setEditId(null);
    setShowForm(true);
    setExpanded(prev => new Set(prev).add(parentId));
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const inputClass = 'w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm px-4 py-3 transition-colors';

  const renderCategory = (cat: Category, depth: number) => {
    const hasChildren = cat.children && cat.children.length > 0;
    const isExpanded = expanded.has(cat.id);

    return (
      <div key={cat.id}>
        <div
          className={`flex items-center gap-3 px-6 py-4 border-b border-[#BFA06A]/5 hover:bg-white/[0.02] transition-colors ${depth > 0 ? 'bg-[#0A0A0A]/50' : ''}`}
          style={{ paddingLeft: `${24 + depth * 32}px` }}
        >
          {/* Expand/Collapse */}
          <button
            onClick={() => hasChildren && toggleExpand(cat.id)}
            className={`w-5 h-5 flex items-center justify-center shrink-0 ${hasChildren ? 'cursor-pointer text-[#F0E6C2]/40 hover:text-[#BFA06A]' : 'text-transparent'}`}
          >
            {hasChildren ? (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />) : <span className="w-1 h-1 rounded-full bg-[#BFA06A]/20" />}
          </button>

          {/* Icon */}
          <FolderTree className={`w-4 h-4 shrink-0 ${depth === 0 ? 'text-[#BFA06A]' : 'text-[#BFA06A]/40'}`} />

          {/* Name */}
          <div className="flex-1 min-w-0">
            <span className={`font-montserrat text-sm ${depth === 0 ? 'text-[#F0E6C2] font-medium' : 'text-[#F0E6C2]/70'}`}>
              {cat.name}
            </span>
            <span className="font-montserrat text-[#F0E6C2]/20 text-xs ml-2">/{cat.slug}</span>
          </div>

          {/* Product count */}
          <span className="font-montserrat text-[#F0E6C2]/40 text-xs shrink-0">
            {cat._count.products} product{cat._count.products !== 1 ? 's' : ''}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleAddSubCategory(cat.id)}
              className="p-2 text-[#F0E6C2]/30 hover:text-green-400 transition-colors cursor-pointer"
              title="Add sub-category"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleEdit(cat)} className="p-2 text-[#F0E6C2]/30 hover:text-[#BFA06A] transition-colors cursor-pointer">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleDelete(cat.id)} className="p-2 text-[#F0E6C2]/30 hover:text-red-400 transition-colors cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && cat.children!.map(child => renderCategory(child, depth + 1))}
      </div>
    );
  };

  const selectedParentName = form.parentId
    ? allCategories.find(c => c.id === form.parentId)?.name
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-white text-3xl font-medium">Categories</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', slug: '', sortOrder: 0, parentId: '' }); }}
          className="flex items-center gap-2 bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.2em] uppercase px-5 py-3 font-semibold hover:bg-[#D4B580] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-6 rounded mb-8">
          {selectedParentName && (
            <div className="mb-4 flex items-center gap-2">
              <span className="font-montserrat text-[#BFA06A] text-xs tracking-[0.15em] uppercase">Adding sub-category under:</span>
              <span className="font-montserrat text-[#F0E6C2] text-sm font-medium">{selectedParentName}</span>
              <button type="button" onClick={() => setForm({ ...form, parentId: '' })} className="text-[#F0E6C2]/40 hover:text-red-400 text-xs cursor-pointer ml-2">(remove)</button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="font-montserrat text-[#F0E6C2]/70 text-xs tracking-[0.2em] uppercase block mb-2">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: editId ? form.slug : generateSlug(e.target.value) })}
                required
                placeholder="e.g. Temple Collection"
                className={inputClass}
              />
            </div>
            <div>
              <label className="font-montserrat text-[#F0E6C2]/70 text-xs tracking-[0.2em] uppercase block mb-2">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className={inputClass} />
            </div>
            <div>
              <label className="font-montserrat text-[#F0E6C2]/70 text-xs tracking-[0.2em] uppercase block mb-2">Parent Category</label>
              <select
                value={form.parentId}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                className={`${inputClass} appearance-none`}
              >
                <option value="">None (Top Level)</option>
                {allCategories.filter(c => !c.parentId && c.id !== editId).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <div className="w-20">
                <label className="font-montserrat text-[#F0E6C2]/70 text-xs tracking-[0.2em] uppercase block mb-2">Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className={inputClass} />
              </div>
              <div className="flex-1 flex items-end">
                <button type="submit" className="w-full bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.2em] uppercase px-6 py-3 font-semibold hover:bg-[#D4B580] cursor-pointer">
                  {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tree View */}
      <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded overflow-hidden">
        <div className="px-6 py-4 border-b border-[#BFA06A]/10 flex items-center justify-between">
          <h2 className="font-montserrat text-[#F0E6C2] text-sm tracking-[0.2em] uppercase font-medium">Category Tree</h2>
          <p className="font-montserrat text-[#F0E6C2]/30 text-xs">Click + to add sub-categories</p>
        </div>
        {rootCategories.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-montserrat text-[#F0E6C2]/40 text-sm">No categories yet. Create one to get started.</p>
          </div>
        ) : (
          rootCategories.map(cat => renderCategory(cat, 0))
        )}
      </div>
    </div>
  );
}
