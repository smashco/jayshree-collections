'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

function OrderConfirmationContent() {
    const params = useSearchParams();
    const orderNumber = params.get('order');
    const paymentId = params.get('payment');

    return (
        <section className="flex-1 pt-32 pb-20 md:pt-48 md:pb-32 relative z-20 flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-6 text-center w-full">
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-20 h-20 mx-auto mb-10 border border-[#BFA06A]/40 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#BFA06A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
                    <p className="font-montserrat text-[#BFA06A] text-[0.6rem] tracking-[0.6em] uppercase mb-4">Payment Confirmed</p>
                    <h1 className="font-cormorant text-white font-light leading-none mb-6" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
                        Thank You for Your <em className="text-[#BFA06A]">Order</em>
                    </h1>
                    <p className="font-montserrat text-[#F0E6C2]/60 text-sm leading-relaxed mb-10 max-w-md mx-auto">
                        Your jewellery has been reserved and our craftsmen have been notified. We will send a confirmation email shortly.
                    </p>

                    <div className="border border-[#BFA06A]/15 p-8 mb-10 text-left space-y-4">
                        {orderNumber && (
                            <div className="flex justify-between items-center border-b border-[#BFA06A]/10 pb-4">
                                <span className="font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.2em] uppercase">Order Number</span>
                                <span className="font-montserrat text-[#BFA06A] text-sm font-medium tracking-wider">{orderNumber}</span>
                            </div>
                        )}
                        {paymentId && (
                            <div className="flex justify-between items-center border-b border-[#BFA06A]/10 pb-4">
                                <span className="font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.2em] uppercase">Payment ID</span>
                                <span className="font-montserrat text-[#F0E6C2]/70 text-xs">{paymentId}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center border-b border-[#BFA06A]/10 pb-4">
                            <span className="font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.2em] uppercase">Status</span>
                            <span className="font-montserrat text-green-400 text-xs tracking-wider uppercase">Confirmed & Paid</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.2em] uppercase">Delivery</span>
                            <span className="font-montserrat text-[#F0E6C2]/70 text-xs text-right">Tracking details sent via email once shipped</span>
                        </div>
                    </div>

                    <div className="mb-12 text-left">
                        <p className="font-montserrat text-[#BFA06A]/80 text-[0.6rem] tracking-[0.5em] uppercase mb-6 text-center">What Happens Next</p>
                        <div className="space-y-4">
                            {[
                                { step: '01', title: 'Order Confirmed', desc: 'Payment verified and order locked in.' },
                                { step: '02', title: 'Carefully Packed', desc: 'Individually inspected and packed in our signature box.' },
                                { step: '03', title: 'Shipped', desc: 'Dispatched with tracking — SMS and email notification sent.' },
                                { step: '04', title: 'Delivered', desc: 'Insured delivery right to your door.' },
                            ].map(item => (
                                <div key={item.step} className="flex gap-5 items-start">
                                    <span className="font-cormorant text-[#BFA06A]/40 text-2xl font-light leading-none shrink-0 w-8">{item.step}</span>
                                    <div>
                                        <p className="font-montserrat text-[#F0E6C2] text-sm font-medium">{item.title}</p>
                                        <p className="font-montserrat text-[#F0E6C2]/50 text-xs mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/shop" className="btn-gold inline-flex items-center justify-center px-8 py-4"><span>Continue Shopping</span></Link>
                        <Link href="/" className="border border-[#BFA06A]/20 text-[#F0E6C2]/70 font-montserrat text-xs tracking-[0.25em] uppercase px-8 py-4 hover:border-[#BFA06A]/50 transition-colors text-center">Return Home</Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default function OrderConfirmationPage() {
    return (
        <main className="min-h-screen bg-black flex flex-col">
            <Navbar />
            <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[#F0E6C2]/40 font-montserrat text-sm">Loading...</div>}>
                <OrderConfirmationContent />
            </Suspense>
            <Footer />
        </main>
    );
}
