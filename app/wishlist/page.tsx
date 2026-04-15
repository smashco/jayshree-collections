'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistPage() {
    const { items, remove } = useWishlist();

    return (
        <main className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 md:pt-48 md:pb-32 relative z-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
                    <div className="flex flex-col items-center text-center mb-16 md:mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <p className="font-montserrat text-[#BFA06A] text-[0.65rem] md:text-[0.7rem] tracking-[0.5em] uppercase font-medium mb-4 drop-shadow-sm">
                                Your Saved Pieces
                            </p>
                            <h1
                                className="font-cormorant text-white font-medium leading-none mb-4 drop-shadow-lg"
                                style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
                            >
                                Wish <em className="text-[#BFA06A] drop-shadow-md">List</em>
                            </h1>
                            <p className="font-montserrat text-[#F0E6C2]/50 text-sm">{items.length} piece{items.length !== 1 ? 's' : ''}</p>
                        </motion.div>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-20">
                            <Heart className="w-12 h-12 text-[#BFA06A]/30 mx-auto mb-6" />
                            <p className="font-montserrat text-[#F0E6C2]/60 text-sm mb-8">Your wishlist is empty.</p>
                            <Link href="/shop" className="inline-block border border-[#BFA06A]/30 text-[#BFA06A] font-montserrat text-xs tracking-[0.3em] uppercase px-8 py-4 hover:bg-[#BFA06A] hover:text-black transition-colors">
                                Explore the Collection
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.slug}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.05 }}
                                    className="group flex flex-col relative"
                                >
                                    <button
                                        onClick={() => remove(item.slug)}
                                        className="absolute top-3 right-3 z-30 w-9 h-9 bg-black/60 backdrop-blur-sm border border-[#BFA06A]/30 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all cursor-pointer"
                                        aria-label="Remove from wishlist"
                                    >
                                        <X className="w-4 h-4 text-white/80" />
                                    </button>
                                    <Link href={`/product/${item.slug}`} className="relative aspect-[4/5] overflow-hidden bg-[#111] mb-6 border border-[#BFA06A]/10 group-hover:border-[#BFA06A]/30 transition-colors duration-500 block">
                                        {item.discountPercent && (
                                            <div className="absolute top-3 left-3 z-20 bg-[#BFA06A] text-black font-montserrat text-[0.6rem] md:text-xs tracking-[0.15em] uppercase font-bold px-2.5 py-1">
                                                {item.discountPercent}% Off
                                            </div>
                                        )}
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        />
                                    </Link>
                                    <Link href={`/product/${item.slug}`} className="flex flex-col items-center text-center px-2 cursor-pointer">
                                        <p className="font-montserrat text-[#BFA06A]/90 text-[0.6rem] md:text-[0.65rem] tracking-[0.3em] uppercase mb-2 font-medium">
                                            {item.material}
                                        </p>
                                        <h3 className="font-cormorant text-white text-2xl font-medium mb-3 group-hover:text-[#BFA06A] transition-colors drop-shadow-sm">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-baseline gap-3">
                                            <p className="font-montserrat text-[#BFA06A] text-sm md:text-base tracking-widest font-medium">
                                                {item.formattedPrice}
                                            </p>
                                            {item.formattedCompareAtPrice && (
                                                <p className="font-montserrat text-[#F0E6C2]/40 text-xs md:text-sm line-through">
                                                    {item.formattedCompareAtPrice}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
