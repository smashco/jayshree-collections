'use client';

import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, subtotal, totalItems } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const tax = subtotal * 0.03; // Simple 3% mock GST
    const total = subtotal + tax;

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
                    <h1 className="font-cormorant text-[#F0E6C2] text-4xl md:text-5xl font-light mb-4 text-center md:text-left">
                        Secure <em className="text-[#BFA06A]">Checkout</em>
                    </h1>
                </motion.div>

                {items.length === 0 ? (
                    <div className="text-center py-32 border-y border-[#BFA06A]/10">
                        <p className="font-cormorant text-[#F0E6C2] text-2xl mb-6">Your bag is empty.</p>
                        <Link href="/shop" className="btn-gold inline-flex">
                            <span>Return to Shop</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                        {/* Left Side: Form */}
                        <div className="lg:col-span-7 flex flex-col gap-12">
                            {/* Contact Info */}
                            <div>
                                <h2 className="font-montserrat text-[#F0E6C2] text-[0.65rem] tracking-[0.3em] uppercase mb-6 border-b border-[#BFA06A]/20 pb-4">
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <input type="email" placeholder="Email Address *" className="w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-[#F0E6C2] font-montserrat text-sm px-4 py-3 transition-colors placeholder:text-[#F0E6C2]/30" />
                                    <input type="tel" placeholder="Phone Number *" className="w-full bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-[#F0E6C2] font-montserrat text-sm px-4 py-3 transition-colors placeholder:text-[#F0E6C2]/30" />
                                    <label className="flex items-center gap-3 cursor-pointer mt-4">
                                        <input type="checkbox" className="accent-[#BFA06A] bg-transparent border-[#BFA06A]/30 w-4 h-4 cursor-pointer" />
                                        <span className="font-montserrat text-[#F0E6C2]/60 text-xs tracking-widest">Email me with news and luxury offers</span>
                                    </label>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h2 className="font-montserrat text-[#F0E6C2] text-[0.65rem] tracking-[0.3em] uppercase mb-6 border-b border-[#BFA06A]/20 pb-4">
                                    Shipping Details
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="First Name *" className="col-span-1 bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-[#F0E6C2] font-montserrat text-sm px-4 py-3 transition-colors placeholder:text-[#F0E6C2]/30" />
                                    <input type="text" placeholder="Last Name *" className="col-span-1 bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-[#F0E6C2] font-montserrat text-sm px-4 py-3 transition-colors placeholder:text-[#F0E6C2]/30" />
                                    <input type="text" placeholder="Address *" className="col-span-2 bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-[#F0E6C2] font-montserrat text-sm px-4 py-3 transition-colors placeholder:text-[#F0E6C2]/30" />
                                    <input type="text" placeholder="Apartment, suite, etc. (optional)" className="col-span-2 bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-[#F0E6C2] font-montserrat text-sm px-4 py-3 transition-colors placeholder:text-[#F0E6C2]/30" />
                                    <input type="text" placeholder="City *" className="col-span-1 bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-[#F0E6C2] font-montserrat text-sm px-4 py-3 transition-colors placeholder:text-[#F0E6C2]/30" />
                                    <div className="col-span-1 grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="State *" className="col-span-1 bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-[#F0E6C2] font-montserrat text-sm px-4 py-3 transition-colors placeholder:text-[#F0E6C2]/30" />
                                        <input type="text" placeholder="PIN Code *" className="col-span-1 bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-[#F0E6C2] font-montserrat text-sm px-4 py-3 transition-colors placeholder:text-[#F0E6C2]/30" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Order Summary */}
                        <div className="lg:col-span-5 relative">
                            <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 p-8 lg:p-10 sticky top-32">
                                <h2 className="font-montserrat text-[#F0E6C2] text-[0.65rem] tracking-[0.3em] uppercase mb-8 border-b border-[#BFA06A]/20 pb-4">
                                    Order Summary ({totalItems})
                                </h2>

                                {/* Items list */}
                                <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-20 bg-[#111] shrink-0 border border-[#BFA06A]/10">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-cormorant text-[#F0E6C2] leading-tight pr-4">
                                                        {item.name}
                                                    </h3>
                                                    <p className="font-montserrat text-[#BFA06A] text-xs tracking-widest whitespace-nowrap">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                                <p className="font-montserrat text-[9px] tracking-widest uppercase text-[#F0E6C2]/40 mt-1">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-t border-[#BFA06A]/20 pt-6 space-y-4 mb-8">
                                    <div className="flex justify-between font-montserrat text-xs tracking-widest text-[#F0E6C2]/70">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between font-montserrat text-xs tracking-widest text-[#F0E6C2]/70">
                                        <span>Shipping</span>
                                        <span>Complimentary</span>
                                    </div>
                                    <div className="flex justify-between font-montserrat text-xs tracking-widest text-[#F0E6C2]/70">
                                        <span>Estimated Taxes (3%)</span>
                                        <span>{formatPrice(tax)}</span>
                                    </div>
                                    <div className="flex justify-between font-montserrat text-sm tracking-widest text-[#BFA06A] border-t border-[#BFA06A]/10 pt-4 mt-2">
                                        <span className="uppercase font-medium">Total</span>
                                        <span className="font-semibold">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-[#BFA06A] text-black font-montserrat text-[0.65rem] tracking-[0.3em] uppercase py-5 font-medium hover:bg-[#D4B580] transition-colors cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        alert('This is a demo. Checkout flow is mocked!');
                                    }}
                                >
                                    Complete Order
                                </button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[#F0E6C2]/40">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span className="font-montserrat text-[9px] tracking-widest uppercase">Secure 256-bit Encryption</span>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
