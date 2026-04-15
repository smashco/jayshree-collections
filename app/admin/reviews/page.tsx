'use client';

import { useEffect, useState } from 'react';
import { Star, Check, Trash2, X } from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string | null;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product: { id: string; name: string; slug: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/reviews?status=${filter}`);
    if (res.ok) setReviews(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const approve = async (id: string, isApproved: boolean) => {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved }),
    });
    if (res.ok) fetchReviews();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this review? Cannot be undone.')) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) fetchReviews();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-cormorant text-white text-3xl font-medium">Reviews ({reviews.length})</h1>
        <div className="flex gap-2">
          {(['pending', 'approved', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-montserrat text-xs tracking-[0.2em] uppercase px-4 py-2 font-semibold transition-colors cursor-pointer ${filter === f ? 'bg-[#BFA06A] text-black' : 'border border-[#BFA06A]/20 text-[#F0E6C2]/70 hover:border-[#BFA06A]/50'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="font-montserrat text-[#F0E6C2]/40 text-sm text-center py-20">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="font-montserrat text-[#F0E6C2]/40 text-sm text-center py-20">No {filter === 'all' ? '' : filter} reviews.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className={`bg-[#0A0A0A] border p-6 rounded ${r.isApproved ? 'border-green-500/20' : 'border-amber-500/20'}`}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} className={`w-4 h-4 ${n <= r.rating ? 'text-[#BFA06A] fill-[#BFA06A]' : 'text-[#F0E6C2]/20'}`} />
                      ))}
                    </div>
                    <span className={`font-montserrat text-[0.6rem] tracking-[0.2em] uppercase px-2 py-0.5 rounded ${r.isApproved ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {r.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="font-montserrat text-[#F0E6C2] text-sm font-medium">
                    {r.customerName} <span className="text-[#F0E6C2]/40">· {r.customerEmail}</span>
                  </p>
                  <p className="font-montserrat text-[#F0E6C2]/40 text-xs mt-1">
                    {formatDate(r.createdAt)} · <a href={`/product/${r.product.slug}`} target="_blank" className="text-[#BFA06A] hover:underline">{r.product.name}</a>
                  </p>
                </div>
                <div className="flex gap-2">
                  {r.isApproved ? (
                    <button
                      onClick={() => approve(r.id, false)}
                      className="flex items-center gap-2 border border-amber-500/30 text-amber-400 font-montserrat text-[0.6rem] tracking-[0.15em] uppercase px-3 py-2 hover:bg-amber-500/10 cursor-pointer"
                    >
                      <X className="w-3 h-3" /> Unapprove
                    </button>
                  ) : (
                    <button
                      onClick={() => approve(r.id, true)}
                      className="flex items-center gap-2 bg-green-600/20 border border-green-500/40 text-green-400 font-montserrat text-[0.6rem] tracking-[0.15em] uppercase px-3 py-2 hover:bg-green-600/30 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => remove(r.id)}
                    className="flex items-center gap-2 border border-red-500/30 text-red-400 font-montserrat text-[0.6rem] tracking-[0.15em] uppercase px-3 py-2 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {r.title && <h3 className="font-cormorant text-white text-xl font-medium mb-2">{r.title}</h3>}
              <p className="font-montserrat text-[#F0E6C2]/70 text-sm leading-relaxed whitespace-pre-wrap">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
