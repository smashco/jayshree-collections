'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductListItem } from '@/lib/products';
import { LOW_STOCK_THRESHOLD } from '@/lib/products';

interface NewArrivalsProps {
    products: ProductListItem[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="bg-[#050505] py-20 md:py-32 relative z-20 border-t border-[#BFA06A]/10">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-14"
                >
                    <p className="font-montserrat text-[#BFA06A] text-[0.6rem] md:text-[0.7rem] tracking-[0.5em] uppercase font-medium mb-4 drop-shadow-sm">
                        Just Dropped
                    </p>
                    <h2
                        className="font-cormorant text-white font-medium leading-none drop-shadow-lg"
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                    >
                        New <em className="text-[#BFA06A]">Arrivals</em>
                    </h2>
                </motion.div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {products.map((product, index) => (
                        <motion.div
                            key={product.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.08 }}
                            className="group min-w-[70vw] sm:min-w-[40vw] md:min-w-[28vw] lg:min-w-[22vw] snap-center shrink-0"
                        >
                            <Link href={`/product/${product.slug}`} className="block">
                                <div className="relative aspect-[4/5] overflow-hidden bg-[#111] mb-4 border border-[#BFA06A]/10 group-hover:border-[#BFA06A]/30 transition-colors">
                                    {product.discountPercent && (
                                        <div className="absolute top-3 left-3 z-20 bg-[#BFA06A] text-black font-montserrat text-[0.6rem] tracking-[0.15em] uppercase font-bold px-2.5 py-1">
                                            {product.discountPercent}% Off
                                        </div>
                                    )}
                                    {product.totalStock === 0 ? (
                                        <div className="absolute top-3 right-3 z-20 bg-red-600/95 text-white font-montserrat text-[0.6rem] tracking-[0.15em] uppercase font-bold px-2.5 py-1">
                                            Sold Out
                                        </div>
                                    ) : product.totalStock <= LOW_STOCK_THRESHOLD && (
                                        <div className="absolute top-3 right-3 z-20 bg-amber-600/95 text-white font-montserrat text-[0.55rem] tracking-[0.15em] uppercase font-bold px-2.5 py-1">
                                            Only {product.totalStock} Left
                                        </div>
                                    )}
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        sizes="(max-width: 768px) 70vw, 25vw"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="font-montserrat text-[#BFA06A]/90 text-[0.6rem] tracking-[0.3em] uppercase mb-2 font-medium">
                                        {product.material}
                                    </p>
                                    <h3 className="font-cormorant text-white text-xl md:text-2xl font-medium mb-2 group-hover:text-[#BFA06A] transition-colors drop-shadow-sm">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <p className="font-montserrat text-[#BFA06A] text-sm tracking-widest font-medium">{product.formattedPrice}</p>
                                        {product.formattedCompareAtPrice && (
                                            <p className="font-montserrat text-[#F0E6C2]/40 text-xs line-through">{product.formattedCompareAtPrice}</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/shop" className="inline-block border border-[#BFA06A]/30 text-[#BFA06A] font-montserrat text-xs tracking-[0.3em] uppercase px-8 py-4 hover:bg-[#BFA06A] hover:text-black transition-colors cursor-pointer">
                        Shop All New Arrivals
                    </Link>
                </div>
            </div>
        </section>
    );
}
