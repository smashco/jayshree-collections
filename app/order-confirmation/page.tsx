'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order');

    return (
        <main className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <section className="flex-1 flex items-center justify-center px-6">
                <div className="text-center max-w-lg">
                    <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-[#BFA06A]/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#BFA06A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="font-cormorant text-white text-4xl md:text-5xl font-medium mb-4">
                        Thank <em className="text-[#BFA06A]">You</em>
                    </h1>

                    <p className="font-montserrat text-[#F0E6C2]/70 text-sm md:text-base mb-2">
                        Your order has been placed successfully.
                    </p>

                    {orderNumber && (
                        <p className="font-montserrat text-[#BFA06A] text-lg tracking-widest mb-8">
                            {orderNumber}
                        </p>
                    )}

                    <p className="font-montserrat text-[#F0E6C2]/50 text-xs tracking-widest mb-12">
                        We will send you an email confirmation with order details.
                    </p>

                    <Link href="/shop" className="btn-gold inline-flex px-8 py-4 font-bold tracking-widest text-sm">
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <OrderConfirmationContent />
        </Suspense>
    );
}
