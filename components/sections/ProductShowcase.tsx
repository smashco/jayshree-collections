'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductItem {
    slug: string;
    name: string;
    category: string;
    price: number;
    formattedPrice: string;
    compareAtPrice: number | null;
    formattedCompareAtPrice: string | null;
    discountPercent: number | null;
    totalStock: number;
    image: string;
    material: string;
}

const LOW_STOCK_THRESHOLD = 5;

const categories = ['All', 'Necklaces', 'Earrings', 'Bangles', 'Rings'];

export default function ProductShowcase() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [products, setProducts] = useState<ProductItem[]>([]);


    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(console.error);
    }, []);

    const filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(p => p.category === activeCategory);

    const handleAddToCart = (product: ProductItem) => {
        // Redirect to product page where variant can be selected
        window.location.href = `/product/${product.slug}`;
    };

    return (
        <section className="bg-black py-20 md:py-32 relative z-20" id="shop">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">

                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-16 w-full max-w-[100vw] overflow-hidden">
                    {/* Animated Line Above Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="w-full overflow-hidden border-y border-[#BFA06A]/20 mb-8 py-3 bg-[#BFA06A]/5"
                    >
                        <div className="marquee-track flex whitespace-nowrap">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <span key={i} className="font-montserrat text-[#BFA06A] text-[0.65rem] md:text-[0.75rem] tracking-[0.3em] uppercase font-semibold mx-6 shrink-0">
                                    Maharashtra &nbsp;•&nbsp; Est. 1976 &nbsp;•&nbsp; Jayashri Maison &nbsp;•&nbsp; Crafted in Maharashtra &nbsp;•&nbsp; Est. 1976 &nbsp;•&nbsp;
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2
                            className="font-cormorant text-white font-medium leading-none mb-8 drop-shadow-xl"
                            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
                        >
                            Curated <em className="text-[#BFA06A]">Excellence</em>
                        </h2>
                    </motion.div>

                    {/* Category Filters */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-6 md:gap-10 border-b border-[#BFA06A]/15 pb-4 w-full max-w-2xl"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`font-montserrat text-[0.7rem] md:text-[0.75rem] tracking-[0.3em] uppercase transition-all duration-500 relative pb-4 font-medium
                                    ${activeCategory === cat ? 'text-[#BFA06A]' : 'text-[#F0E6C2]/70 hover:text-white'}`}
                            >
                                {cat}
                                {activeCategory === cat && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-[-1px] left-0 right-0 h-px bg-[#BFA06A]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Product Slider */}
                <motion.div
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 w-full"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    layout
                >
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.slug}
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="group flex flex-col cursor-pointer min-w-[70vw] sm:min-w-[35vw] lg:min-w-[22vw] snap-center shrink-0"
                        >
                            {/* Image Container with Hover Effect */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-[#111] mb-6 border border-[#BFA06A]/10 group-hover:border-[#BFA06A]/30 transition-colors duration-500">
                                {product.discountPercent && (
                                    <div className="absolute top-3 left-3 z-30 bg-[#BFA06A] text-black font-montserrat text-[0.6rem] md:text-xs tracking-[0.15em] uppercase font-bold px-2.5 py-1">
                                        {product.discountPercent}% Off
                                    </div>
                                )}
                                {product.totalStock === 0 ? (
                                    <div className="absolute top-3 right-3 z-30 bg-red-600/95 text-white font-montserrat text-[0.6rem] md:text-xs tracking-[0.15em] uppercase font-bold px-2.5 py-1">
                                        Sold Out
                                    </div>
                                ) : product.totalStock <= LOW_STOCK_THRESHOLD && (
                                    <div className="absolute top-3 right-3 z-30 bg-amber-600/95 text-white font-montserrat text-[0.55rem] md:text-[0.65rem] tracking-[0.15em] uppercase font-bold px-2.5 py-1">
                                        Only {product.totalStock} Left
                                    </div>
                                )}
                                <Link href={`/product/${product.slug}`} className="block w-full h-full cursor-pointer z-10 relative">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Link>

                                {/* Action Button (Add to Bag / Explore) */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 flex justify-center">
                                    <button
                                        disabled={product.totalStock === 0}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (product.totalStock === 0) return;
                                            handleAddToCart(product);
                                        }}
                                        className="bg-[#BFA06A] text-black font-montserrat text-[0.65rem] md:text-xs tracking-[0.2em] uppercase py-3 px-8 w-full font-semibold hover:bg-[#D4B580] transition-colors cursor-pointer disabled:bg-[#555] disabled:text-white/60 disabled:cursor-not-allowed"
                                    >
                                        {product.totalStock === 0 ? 'Sold Out' : 'Add to Bag'}
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <Link href={`/product/${product.slug}`} className="flex flex-col items-center text-center px-4 cursor-pointer">
                                <p className="font-montserrat text-[#BFA06A]/90 text-[0.6rem] md:text-[0.65rem] tracking-[0.3em] uppercase mb-2 font-medium">
                                    {product.material}
                                </p>
                                <h3 className="font-cormorant text-white text-2xl md:text-3xl font-medium mb-3 group-hover:text-[#BFA06A] transition-colors drop-shadow-sm">
                                    {product.name}
                                </h3>
                                <div className="flex items-baseline gap-3">
                                    <p className="font-montserrat text-[#BFA06A] text-sm md:text-base tracking-widest font-medium">
                                        {product.formattedPrice}
                                    </p>
                                    {product.formattedCompareAtPrice && (
                                        <p className="font-montserrat text-[#F0E6C2]/40 text-xs md:text-sm line-through">
                                            {product.formattedCompareAtPrice}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Details */}
                <div className="text-center mt-20">
                    <Link href="/shop" className="btn-gold cursor-pointer inline-flex items-center gap-3 group">
                        <span>Discover Full Range</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
