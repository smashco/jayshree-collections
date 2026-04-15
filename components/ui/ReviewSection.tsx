'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface Review {
    id: string;
    customerName: string;
    rating: number;
    title: string | null;
    comment: string;
    createdAt: string;
}

interface ReviewData {
    reviews: Review[];
    count: number;
    averageRating: number;
}

export default function ReviewSection({ productId }: { productId: string }) {
    const [data, setData] = useState<ReviewData>({ reviews: [], count: 0, averageRating: 0 });
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({ customerName: '', customerEmail: '', rating: 5, title: '', comment: '' });

    useEffect(() => {
        fetch(`/api/reviews?productId=${productId}`)
            .then(r => r.json())
            .then(setData)
            .catch(console.error);
    }, [productId]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, ...form }),
            });
            const result = await res.json();
            if (res.ok) {
                setMessage('✓ Thank you! Your review is pending approval.');
                setForm({ customerName: '', customerEmail: '', rating: 5, title: '', comment: '' });
                setTimeout(() => setShowForm(false), 2000);
            } else {
                setMessage(result.error || 'Something went wrong');
            }
        } catch {
            setMessage('Failed to submit. Please try again.');
        }
        setSubmitting(false);
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <section className="mt-24 border-t border-[#BFA06A]/15 pt-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
                <div>
                    <p className="font-montserrat text-[#BFA06A] text-[0.6rem] tracking-[0.4em] uppercase mb-2">Customer Reviews</p>
                    <h2 className="font-cormorant text-white text-4xl md:text-5xl font-medium drop-shadow-md">
                        What Our <em className="text-[#BFA06A]">Patrons Say</em>
                    </h2>
                    {data.count > 0 && (
                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <Star key={n} className={`w-5 h-5 ${n <= Math.round(data.averageRating) ? 'text-[#BFA06A] fill-[#BFA06A]' : 'text-[#F0E6C2]/20'}`} />
                                ))}
                            </div>
                            <span className="font-montserrat text-[#F0E6C2] text-sm">{data.averageRating.toFixed(1)} · {data.count} review{data.count !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.25em] uppercase px-8 py-4 font-semibold hover:bg-[#D4B580] transition-colors cursor-pointer self-start"
                >
                    {showForm ? 'Cancel' : 'Write a Review'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={submit} className="bg-[#0A0A0A] border border-[#BFA06A]/15 p-8 mb-12">
                    <div className="mb-6">
                        <label className="font-montserrat text-[#BFA06A] text-[0.6rem] tracking-[0.3em] uppercase block mb-3">Your Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    type="button"
                                    key={n}
                                    onClick={() => setForm({ ...form, rating: n })}
                                    className="cursor-pointer"
                                >
                                    <Star className={`w-8 h-8 ${n <= form.rating ? 'text-[#BFA06A] fill-[#BFA06A]' : 'text-[#F0E6C2]/20'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="font-montserrat text-[#F0E6C2]/60 text-[0.6rem] tracking-[0.3em] uppercase block mb-2">Name *</label>
                            <input
                                type="text"
                                required
                                value={form.customerName}
                                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                                className="w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm px-4 py-3 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="font-montserrat text-[#F0E6C2]/60 text-[0.6rem] tracking-[0.3em] uppercase block mb-2">Email *</label>
                            <input
                                type="email"
                                required
                                value={form.customerEmail}
                                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                                className="w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm px-4 py-3 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="font-montserrat text-[#F0E6C2]/60 text-[0.6rem] tracking-[0.3em] uppercase block mb-2">Title (optional)</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Sum it up in a few words"
                            className="w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm px-4 py-3 transition-colors placeholder:text-[#F0E6C2]/20"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="font-montserrat text-[#F0E6C2]/60 text-[0.6rem] tracking-[0.3em] uppercase block mb-2">Your Review *</label>
                        <textarea
                            required
                            rows={5}
                            minLength={5}
                            maxLength={1000}
                            value={form.comment}
                            onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            placeholder="Tell us what you loved about this piece..."
                            className="w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm px-4 py-3 transition-colors resize-none placeholder:text-[#F0E6C2]/20"
                        />
                    </div>
                    {message && (
                        <p className={`font-montserrat text-sm mb-4 ${message.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.3em] uppercase py-4 font-bold hover:bg-[#D4B580] transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            {data.reviews.length === 0 ? (
                <p className="font-montserrat text-[#F0E6C2]/40 text-sm text-center py-12">No reviews yet. Be the first to review this piece.</p>
            ) : (
                <div className="space-y-8">
                    {data.reviews.map((r) => (
                        <div key={r.id} className="border border-[#BFA06A]/10 p-6 md:p-8">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex mb-2">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <Star key={n} className={`w-4 h-4 ${n <= r.rating ? 'text-[#BFA06A] fill-[#BFA06A]' : 'text-[#F0E6C2]/20'}`} />
                                        ))}
                                    </div>
                                    {r.title && <h3 className="font-cormorant text-white text-xl md:text-2xl font-medium mb-1">{r.title}</h3>}
                                    <p className="font-montserrat text-[#F0E6C2]/60 text-xs tracking-wider">{r.customerName} · {formatDate(r.createdAt)}</p>
                                </div>
                            </div>
                            <p className="font-montserrat text-[#F0E6C2]/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{r.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
