'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { items, subtotal, totalItems, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        email: '', phone: '', firstName: '', lastName: '',
        address1: '', address2: '', city: '', state: '', pinCode: '',
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0,
        }).format(price / 100);
    };

    const tax = Math.round(subtotal * 0.03);
    const total = subtotal + tax;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const checkoutItems = items.map(item => ({
            variantId: item.variantId || item.slug,
            quantity: item.quantity,
        }));

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, items: checkoutItems }),
            });

            if (res.ok) {
                const data = await res.json();
                clearCart();
                router.push(`/order-confirmation?order=${data.orderNumber}`);
            } else {
                const err = await res.json();
                setError(err.error || 'Something went wrong');
            }
        } catch {
            setError('Failed to place order. Please try again.');
        }

        setLoading(false);
    };

    const inputClass = 'w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm md:text-base px-5 py-4 transition-colors placeholder:text-[#F0E6C2]/40 rounded-sm';

    return (
        <main className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 md:pt-48 md:pb-32 relative z-20 mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12"
                >
                    <h1 className="font-cormorant text-white text-4xl md:text-5xl lg:text-6xl font-medium mb-4 text-center md:text-left drop-shadow-md">
                        Secure <em className="text-[#BFA06A] drop-shadow-sm">Checkout</em>
                    </h1>
                </motion.div>

                {items.length === 0 ? (
                    <div className="text-center py-32 border-y border-[#BFA06A]/10">
                        <p className="font-cormorant text-white text-2xl md:text-3xl font-medium mb-8">Your bag is empty.</p>
                        <Link href="/shop" className="btn-gold inline-flex px-8 py-4 font-bold tracking-widest text-sm rounded-xl">
                            <span>Return to Shop</span>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-montserrat text-sm px-4 py-3 mb-6">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                            {/* Left Side: Form */}
                            <div className="lg:col-span-7 flex flex-col gap-12">
                                <div>
                                    <h2 className="font-montserrat text-[#F0E6C2] text-[0.7rem] md:text-sm tracking-[0.3em] uppercase mb-6 border-b border-[#BFA06A]/20 pb-4 font-semibold">
                                        Contact Information
                                    </h2>
                                    <div className="space-y-4">
                                        <input type="email" placeholder="Email Address *" required value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                                        <input type="tel" placeholder="Phone Number" value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                                    </div>
                                </div>

                                <div>
                                    <h2 className="font-montserrat text-[#F0E6C2] text-[0.7rem] md:text-sm tracking-[0.3em] uppercase mb-6 border-b border-[#BFA06A]/20 pb-4 font-semibold">
                                        Shipping Details
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="First Name *" required value={form.firstName}
                                            onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} />
                                        <input type="text" placeholder="Last Name *" required value={form.lastName}
                                            onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} />
                                        <input type="text" placeholder="Address *" required value={form.address1}
                                            onChange={(e) => setForm({ ...form, address1: e.target.value })} className={`col-span-2 ${inputClass}`} />
                                        <input type="text" placeholder="Apartment, suite, etc. (optional)" value={form.address2}
                                            onChange={(e) => setForm({ ...form, address2: e.target.value })} className={`col-span-2 ${inputClass}`} />
                                        <input type="text" placeholder="City *" required value={form.city}
                                            onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="State *" required value={form.state}
                                                onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass} />
                                            <input type="text" placeholder="PIN Code *" required value={form.pinCode}
                                                onChange={(e) => setForm({ ...form, pinCode: e.target.value })} className={inputClass} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Order Summary */}
                            <div className="lg:col-span-5 relative">
                                <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-8 lg:p-10 sticky top-32">
                                    <h2 className="font-montserrat text-[#F0E6C2] text-[0.7rem] md:text-sm tracking-[0.3em] uppercase mb-8 border-b border-[#BFA06A]/20 pb-4 font-semibold">
                                        Order Summary ({totalItems})
                                    </h2>

                                    <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                                        {items.map((item) => (
                                            <div key={item.variantId || item.slug} className="flex gap-4">
                                                <div className="relative w-16 h-20 bg-[#111] shrink-0 border border-[#BFA06A]/10">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-cormorant text-white text-[1.1rem] md:text-xl font-medium leading-tight pr-4 drop-shadow-sm">
                                                            {item.name}
                                                        </h3>
                                                        <p className="font-montserrat text-[#BFA06A] text-sm md:text-base tracking-widest whitespace-nowrap font-medium">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </p>
                                                    </div>
                                                    <p className="font-montserrat text-[10px] md:text-xs tracking-widest uppercase text-[#F0E6C2]/70 mt-1 font-medium">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-[#BFA06A]/20 pt-6 space-y-4 mb-8">
                                        <div className="flex justify-between font-montserrat text-xs md:text-sm tracking-widest text-[#F0E6C2]/90 font-medium">
                                            <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between font-montserrat text-xs md:text-sm tracking-widest text-[#F0E6C2]/90 font-medium">
                                            <span>Shipping</span><span>Complimentary</span>
                                        </div>
                                        <div className="flex justify-between font-montserrat text-xs md:text-sm tracking-widest text-[#F0E6C2]/90 font-medium">
                                            <span>Estimated Taxes (3%)</span><span>{formatPrice(tax)}</span>
                                        </div>
                                        <div className="flex justify-between font-montserrat text-base md:text-lg tracking-widest text-[#BFA06A] border-t border-[#BFA06A]/10 pt-4 mt-2">
                                            <span className="uppercase font-bold">Total</span>
                                            <span className="font-bold">{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#BFA06A] text-black font-montserrat text-sm tracking-[0.3em] uppercase py-5 font-semibold hover:bg-[#D4B580] transition-colors cursor-pointer rounded-sm disabled:opacity-50"
                                    >
                                        {loading ? 'Placing Order...' : 'Complete Order'}
                                    </button>

                                    <div className="mt-6 flex items-center justify-center gap-2 text-[#F0E6C2]/40">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span className="font-montserrat text-[10px] md:text-xs font-medium tracking-widest uppercase">Secure 256-bit Encryption</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </section>

            <Footer />
        </main>
    );
}
