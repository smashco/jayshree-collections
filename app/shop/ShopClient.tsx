'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { ProductListItem, LOW_STOCK_THRESHOLD } from '@/lib/products';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useWishlist } from '@/context/WishlistContext';

interface ShopClientProps {
    products: ProductListItem[];
    categoryNames: string[];
    initialSearch?: string;
}

export default function ShopClient({ products, categoryNames, initialSearch = '' }: ShopClientProps) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const { toggle: toggleWishlist, has: isWishlisted } = useWishlist();


    const min = minPrice ? parseInt(minPrice) * 100 : 0;
    const max = maxPrice ? parseInt(maxPrice) * 100 : Infinity;

    const filteredProducts = products.filter(p => {
        if (activeCategory !== 'All' && p.category !== activeCategory) return false;
        if (p.price < min || p.price > max) return false;
        return true;
    });

    const handleAddToCart = (product: ProductListItem) => {
        // Redirect to product page where variant can be selected
        window.location.href = `/product/${product.slug}`;
    };

    return (
        <main className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 md:pt-48 md:pb-32 relative z-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">

                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-16 md:mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <p className="font-montserrat text-[#BFA06A] text-[0.65rem] md:text-[0.7rem] tracking-[0.5em] uppercase font-medium mb-4 drop-shadow-sm">
                                The Collections
                            </p>
                            <h1
                                className="font-cormorant text-white font-medium leading-none mb-4 drop-shadow-lg"
                                style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
                            >
                                {initialSearch ? (
                                    <>Results for <em className="text-[#BFA06A] drop-shadow-md">&ldquo;{initialSearch}&rdquo;</em></>
                                ) : (
                                    <>Shop <em className="text-[#BFA06A] drop-shadow-md">All</em></>
                                )}
                            </h1>
                            {initialSearch && (
                                <p className="font-montserrat text-[#F0E6C2]/50 text-sm mb-8">{products.length} piece{products.length !== 1 ? 's' : ''} found</p>
                            )}
                        </motion.div>

                        {/* Filters */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-6 md:gap-10 border-b border-[#BFA06A]/15 pb-4 w-full max-w-2xl"
                        >
                            {categoryNames.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`font-montserrat text-[0.7rem] md:text-[0.75rem] tracking-[0.3em] uppercase transition-all duration-500 relative pb-4 font-medium
                                        ${activeCategory === cat ? 'text-[#BFA06A]' : 'text-[#F0E6C2]/70 hover:text-white'}`}
                                >
                                    {cat}
                                    {activeCategory === cat && (
                                        <motion.div
                                            layoutId="activeTabShop"
                                            className="absolute bottom-[-1px] left-0 right-0 h-px bg-[#BFA06A]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </motion.div>

                        {/* Price range */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="flex items-center gap-4 mt-6"
                        >
                            <span className="font-montserrat text-[#F0E6C2]/50 text-[0.6rem] tracking-[0.25em] uppercase">Price</span>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="Min ₹"
                                className="w-24 bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-xs px-3 py-2 transition-colors placeholder:text-[#F0E6C2]/30"
                            />
                            <span className="font-montserrat text-[#F0E6C2]/30 text-xs">—</span>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Max ₹"
                                className="w-24 bg-transparent border border-[#BFA06A]/20 focus:border-[#BFA06A] outline-none text-white font-montserrat text-xs px-3 py-2 transition-colors placeholder:text-[#F0E6C2]/30"
                            />
                            {(minPrice || maxPrice) && (
                                <button
                                    onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                                    className="font-montserrat text-[#BFA06A] text-[0.6rem] tracking-[0.2em] uppercase hover:text-[#D4B580] cursor-pointer"
                                >
                                    Clear
                                </button>
                            )}
                        </motion.div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.slug}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.05 }}
                                className="group flex flex-col"
                            >
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
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleWishlist({
                                                slug: product.slug, name: product.name, price: product.price,
                                                formattedPrice: product.formattedPrice, compareAtPrice: product.compareAtPrice,
                                                formattedCompareAtPrice: product.formattedCompareAtPrice,
                                                discountPercent: product.discountPercent, image: product.image, material: product.material,
                                            });
                                        }}
                                        className="absolute bottom-3 right-3 z-30 w-10 h-10 bg-black/60 backdrop-blur-sm border border-[#BFA06A]/30 flex items-center justify-center hover:bg-[#BFA06A] hover:border-[#BFA06A] transition-all cursor-pointer"
                                        aria-label="Toggle wishlist"
                                    >
                                        <Heart className={`w-4 h-4 ${isWishlisted(product.slug) ? 'text-[#BFA06A] fill-[#BFA06A]' : 'text-white/80'}`} />
                                    </button>
                                    <Link href={`/product/${product.slug}`} className="block w-full h-full cursor-pointer z-10 relative">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </Link>

                                    {/* Action Button */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 flex justify-center">
                                        <button
                                            disabled={product.totalStock === 0}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (product.totalStock === 0) return;
                                                handleAddToCart(product);
                                            }}
                                            className="bg-[#BFA06A] text-black font-montserrat text-[0.65rem] md:text-[0.7rem] tracking-[0.2em] uppercase py-3 px-6 w-full font-semibold hover:bg-[#D4B580] transition-colors cursor-pointer disabled:bg-[#555] disabled:text-white/60 disabled:cursor-not-allowed"
                                        >
                                            {product.totalStock === 0 ? 'Sold Out' : 'Add to Bag'}
                                        </button>
                                    </div>
                                </div>

                                <Link href={`/product/${product.slug}`} className="flex flex-col items-center text-center px-2 cursor-pointer">
                                    <p className="font-montserrat text-[#BFA06A]/90 text-[0.6rem] md:text-[0.65rem] tracking-[0.3em] uppercase mb-2 font-medium">
                                        {product.material}
                                    </p>
                                    <h3 className="font-cormorant text-white text-2xl font-medium mb-3 group-hover:text-[#BFA06A] transition-colors drop-shadow-sm">
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
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
