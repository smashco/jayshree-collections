'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { X, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

    // Lock body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isCartOpen]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-[#0A0A0A] border-l border-[#BFA06A]/10 z-50 flex flex-col shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 md:px-10 py-8 border-b border-[#BFA06A]/10 flex items-center justify-between shrink-0">
                            <h2 className="font-cormorant text-2xl md:text-3xl text-[#F0E6C2] font-medium drop-shadow-sm">
                                Sequence ({totalItems})
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-[#F0E6C2]/70 hover:text-[#BFA06A] transition-colors p-2 -mr-2 cursor-pointer"
                            >
                                <X className="w-5 h-5 stroke-[1.5]" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 hide-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                                    <p className="font-montserrat text-sm md:text-base tracking-widest uppercase mb-4 text-[#F0E6C2] font-medium">Your bag is empty</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-[#BFA06A] uppercase tracking-[0.2em] text-xs pb-1 border-b border-[#BFA06A]/30 hover:border-[#BFA06A] transition-colors font-medium cursor-pointer"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-8">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-6 group">
                                            {/* Image */}
                                            <Link href={`/product/${item.id}`} onClick={() => setIsCartOpen(false)} className="relative w-24 h-32 bg-[#111] shrink-0 border border-[#BFA06A]/10 group-hover:border-[#BFA06A]/30 transition-colors cursor-pointer">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </Link>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start gap-4">
                                                        <Link href={`/product/${item.id}`} onClick={() => setIsCartOpen(false)}>
                                                            <h3 className="font-cormorant text-xl md:text-2xl text-[#F0E6C2] font-medium leading-tight pr-4 drop-shadow-sm group-hover:text-[#BFA06A] transition-colors cursor-pointer">
                                                                {item.name}
                                                            </h3>
                                                        </Link>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-[#F0E6C2]/50 hover:text-red-400 transition-colors uppercase text-[10px] md:text-xs tracking-widest shrink-0 mt-1 cursor-pointer font-medium"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                    <p className="font-montserrat text-[11px] md:text-xs tracking-widest uppercase text-[#BFA06A]/80 mt-2 font-medium">
                                                        {item.material}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-4 border border-[#BFA06A]/20 px-3 py-1.5">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="text-[#F0E6C2]/50 hover:text-[#BFA06A] transition-colors cursor-pointer"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="font-montserrat text-xs text-[#F0E6C2] w-4 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="text-[#F0E6C2]/50 hover:text-[#BFA06A] transition-colors cursor-pointer"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <p className="font-montserrat text-sm md:text-base text-[#BFA06A] tracking-widest font-medium">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer (Subtotal & Checkout) */}
                        {items.length > 0 && (
                            <div className="border-t border-[#BFA06A]/10 p-6 md:p-10 shrink-0 bg-[#0A0A0A]">
                                <div className="flex justify-between items-end mb-8">
                                    <span className="font-montserrat text-xs md:text-sm tracking-[0.2em] uppercase text-[#F0E6C2]/90 font-medium">
                                        Subtotal
                                    </span>
                                    <span className="font-cormorant text-4xl text-[#BFA06A] leading-none drop-shadow-sm">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>

                                <p className="font-montserrat text-[11px] md:text-xs tracking-widest uppercase text-[#F0E6C2]/60 mb-6 text-center font-medium">
                                    Taxes and shipping calculated at checkout
                                </p>

                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                >
                                    <button className="w-full bg-[#BFA06A] text-black font-montserrat text-sm tracking-[0.3em] uppercase py-5 font-semibold hover:bg-[#D4B580] transition-colors cursor-pointer">
                                        Proceed to Checkout
                                    </button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
