'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: { name: string; email: string; contact: string };
    theme: { color: string };
    modal: { ondismiss: () => void };
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayInstance {
    open: () => void;
}

const SHIPPING_OPTIONS = [
    { id: 'standard', label: 'Standard Delivery', description: '5–7 business days', price: 0 },
    { id: 'express', label: 'Express Delivery', description: '1–2 business days', price: 49900 },
];

export default function CheckoutPage() {
    const { items, subtotal, totalItems, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

    const [form, setForm] = useState({
        email: '', phone: '', firstName: '', lastName: '',
        address1: '', address2: '', city: '', state: '', pinCode: '',
    });

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price / 100);

    const shippingCost = shippingMethod === 'express' ? 49900 : 0;
    const tax = Math.round(subtotal * 0.03);
    const total = subtotal + tax + shippingCost;

    const loadRazorpayScript = () =>
        new Promise<boolean>((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const validItems = items.filter(item => item.variantId);
        if (validItems.length === 0) {
            setError('Your cart contains items without variant information. Please re-add items from the shop.');
            setLoading(false);
            return;
        }

        try {
            // Load Razorpay script
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error('Payment gateway failed to load. Check your connection.');

            // Create Razorpay order
            const orderRes = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total, receipt: `checkout_${Date.now()}` }),
            });

            if (!orderRes.ok) throw new Error('Failed to initiate payment');
            const { orderId: razorpayOrderId } = await orderRes.json();

            // Open Razorpay modal
            await new Promise<void>((resolve, reject) => {
                const rzp = new window.Razorpay({
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                    amount: total,
                    currency: 'INR',
                    name: 'Jayshree Collections',
                    description: `${totalItems} piece${totalItems > 1 ? 's' : ''} · Luxury Jewellery`,
                    image: '/images/logo.png',
                    order_id: razorpayOrderId,
                    prefill: {
                        name: `${form.firstName} ${form.lastName}`,
                        email: form.email,
                        contact: form.phone,
                    },
                    theme: { color: '#BFA06A' },
                    modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
                    handler: async (response) => {
                        try {
                            // Verify payment & create order
                            const checkoutRes = await fetch('/api/checkout', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    ...form,
                                    shippingMethod,
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature,
                                    items: items.filter(item => item.variantId).map(item => ({ variantId: item.variantId, quantity: item.quantity })),
                                }),
                            });

                            if (!checkoutRes.ok) {
                                const err = await checkoutRes.json();
                                console.error('[checkout] API error:', err);
                                const msg = typeof err.error === 'string' ? err.error : (err.error?.formErrors?.[0] || JSON.stringify(err.details || err.error) || 'Order creation failed');
                                reject(new Error(msg));
                                return;
                            }

                            const data = await checkoutRes.json();
                            clearCart();
                            router.push(`/order-confirmation?order=${data.orderNumber}&payment=${response.razorpay_payment_id}`);
                            resolve();
                        } catch (err) {
                            reject(err);
                        }
                    },
                });
                rzp.open();
            });

        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Something went wrong';
            if (msg !== 'Payment cancelled') setError(msg);
        }

        setLoading(false);
    };

    const inputClass = 'w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-sm px-5 py-4 transition-colors placeholder:text-[#F0E6C2]/40';

    return (
        <main className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 md:pt-48 md:pb-32 relative z-20 mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-20">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-12">
                    <h1 className="font-cormorant text-white text-4xl md:text-6xl font-medium mb-4 text-center md:text-left drop-shadow-md">
                        Secure <em className="text-[#BFA06A]">Checkout</em>
                    </h1>
                </motion.div>

                {items.length === 0 ? (
                    <div className="text-center py-32 border-y border-[#BFA06A]/10">
                        <p className="font-cormorant text-white text-3xl font-medium mb-8">Your bag is empty.</p>
                        <Link href="/shop" className="btn-gold inline-flex px-8 py-4"><span>Return to Shop</span></Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-montserrat text-sm px-4 py-3 mb-6">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                            {/* Left: Form */}
                            <div className="lg:col-span-7 flex flex-col gap-12">

                                {/* Contact */}
                                <div>
                                    <h2 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.3em] uppercase mb-6 border-b border-[#BFA06A]/20 pb-4 font-semibold">Contact Information</h2>
                                    <div className="space-y-4">
                                        <input type="email" placeholder="Email Address *" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
                                        <input type="tel" placeholder="Phone Number *" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <h2 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.3em] uppercase mb-6 border-b border-[#BFA06A]/20 pb-4 font-semibold">Shipping Address</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="First Name *" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className={inputClass} />
                                        <input type="text" placeholder="Last Name *" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className={inputClass} />
                                        <input type="text" placeholder="Address Line 1 *" required value={form.address1} onChange={e => setForm({ ...form, address1: e.target.value })} className={`col-span-2 ${inputClass}`} />
                                        <input type="text" placeholder="Apartment, suite, etc. (optional)" value={form.address2} onChange={e => setForm({ ...form, address2: e.target.value })} className={`col-span-2 ${inputClass}`} />
                                        <input type="text" placeholder="City *" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={inputClass} />
                                        <input type="text" placeholder="State *" required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className={inputClass} />
                                        <input type="text" placeholder="PIN Code *" required value={form.pinCode} onChange={e => setForm({ ...form, pinCode: e.target.value })} className={inputClass} />
                                    </div>
                                </div>

                                {/* Shipping Method */}
                                <div>
                                    <h2 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.3em] uppercase mb-6 border-b border-[#BFA06A]/20 pb-4 font-semibold">Delivery Method</h2>
                                    <div className="space-y-3">
                                        {SHIPPING_OPTIONS.map(option => (
                                            <label key={option.id}
                                                className={`flex items-center justify-between border px-5 py-4 cursor-pointer transition-all duration-300
                                                    ${shippingMethod === option.id ? 'border-[#BFA06A] bg-[#BFA06A]/5' : 'border-[#BFA06A]/15 hover:border-[#BFA06A]/40'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                                                        ${shippingMethod === option.id ? 'border-[#BFA06A]' : 'border-[#BFA06A]/30'}`}>
                                                        {shippingMethod === option.id && <div className="w-2 h-2 rounded-full bg-[#BFA06A]" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-montserrat text-[#F0E6C2] text-sm font-medium">{option.label}</p>
                                                        <p className="font-montserrat text-[#F0E6C2]/50 text-xs">{option.description}</p>
                                                    </div>
                                                </div>
                                                <span className="font-montserrat text-[#BFA06A] text-sm font-medium">
                                                    {option.price === 0 ? 'Free' : formatPrice(option.price)}
                                                </span>
                                                <input type="radio" name="shipping" value={option.id} checked={shippingMethod === option.id}
                                                    onChange={() => setShippingMethod(option.id as 'standard' | 'express')} className="hidden" />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Order Summary */}
                            <div className="lg:col-span-5">
                                <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-8 sticky top-32">
                                    <h2 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.3em] uppercase mb-8 border-b border-[#BFA06A]/20 pb-4 font-semibold">
                                        Order Summary ({totalItems})
                                    </h2>

                                    <div className="space-y-6 mb-8 max-h-[35vh] overflow-y-auto pr-2">
                                        {items.map((item) => (
                                            <div key={item.variantId || item.slug} className="flex gap-4">
                                                <div className="relative w-16 h-20 bg-[#111] shrink-0 border border-[#BFA06A]/10">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-cormorant text-white text-lg font-medium leading-tight pr-2">{item.name}</h3>
                                                        <p className="font-montserrat text-[#BFA06A] text-sm whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                                                    </div>
                                                    <p className="font-montserrat text-[10px] tracking-widest uppercase text-[#F0E6C2]/50 mt-1">
                                                        {item.variantName} · Qty {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-[#BFA06A]/15 pt-6 space-y-3 mb-8">
                                        <div className="flex justify-between font-montserrat text-sm text-[#F0E6C2]/80">
                                            <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between font-montserrat text-sm text-[#F0E6C2]/80">
                                            <span>Shipping</span>
                                            <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                                        </div>
                                        <div className="flex justify-between font-montserrat text-sm text-[#F0E6C2]/80">
                                            <span>GST (3%)</span><span>{formatPrice(tax)}</span>
                                        </div>
                                        <div className="flex justify-between font-montserrat text-base text-[#BFA06A] border-t border-[#BFA06A]/10 pt-4 mt-2">
                                            <span className="uppercase font-bold tracking-widest">Total</span>
                                            <span className="font-bold">{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading}
                                        className="w-full bg-[#BFA06A] text-black font-montserrat text-sm tracking-[0.3em] uppercase py-5 font-bold hover:bg-[#D4B580] transition-colors cursor-pointer disabled:opacity-50">
                                        {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
                                    </button>

                                    <div className="mt-5 flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-2 text-[#F0E6C2]/30">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span className="font-montserrat text-[10px] tracking-widest uppercase">Secured by Razorpay</span>
                                        </div>
                                        <p className="font-montserrat text-[#F0E6C2]/20 text-[9px] tracking-wider text-center">
                                            UPI · Cards · Net Banking · Wallets
                                        </p>
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
