'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { assetUrl } from '@/lib/assets';
import Link from 'next/link';

const products = [
    {
        id: 'lakshmi-temple-choker',
        name: 'Lakshmi Temple Choker',
        nameMarathi: 'लक्ष्मी मंदिर हार',
        price: 129900,
        originalPrice: 199900,
        rating: 4.9,
        reviews: 248,
        image: assetUrl('/images/necklace.png'),
        tag: 'Bestseller',
        category: 'Harams & Sets',
    },
    {
        id: 'pearl-jhumka-set',
        name: 'Pearl Jhumka Set',
        nameMarathi: 'मोती झुमके',
        price: 64900,
        originalPrice: 99900,
        rating: 4.8,
        reviews: 189,
        image: assetUrl('/images/earrings.png'),
        tag: 'New',
        category: 'Jhumkas',
    },
    {
        id: 'enamel-bangle-stack',
        name: 'Enamel Bangle Stack',
        nameMarathi: 'मुलामा बांगड्या',
        price: 89900,
        originalPrice: 139900,
        rating: 4.7,
        reviews: 134,
        image: assetUrl('/images/bangles.png'),
        tag: 'Hot',
        category: 'Kadas & Bangles',
    },
    {
        id: 'kundan-maang-tikka',
        name: 'Kundan Maang Tikka',
        nameMarathi: 'कुंदन मांग टिका',
        price: 159900,
        originalPrice: 249900,
        rating: 5.0,
        reviews: 97,
        image: assetUrl('/images/maangtikka.png'),
        tag: 'Exclusive',
        category: 'Maang Tikkas',
    },
    {
        id: 'paithani-haaram',
        name: 'Paithani Haaram',
        nameMarathi: 'पैठणी हार',
        price: 219900,
        originalPrice: 299900,
        rating: 4.9,
        reviews: 73,
        image: assetUrl('/images/necklace.png'),
        tag: 'Limited',
        category: 'Harams & Sets',
    },
    {
        id: 'gold-jhumki-earrings',
        name: 'Gold Jhumki Earrings',
        nameMarathi: 'सोने झुमकी',
        price: 44900,
        originalPrice: 69900,
        rating: 4.8,
        reviews: 312,
        image: assetUrl('/images/earrings.png'),
        tag: 'Bestseller',
        category: 'Jhumkas',
    },
];

const tagColors: Record<string, string> = {
    Bestseller: '#DB2777',
    New: '#CA8A04',
    Hot: '#DC2626',
    Exclusive: '#7C3AED',
    Limited: '#831843',
};

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
    const [wishlisted, setWishlisted] = useState(false);
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group cursor-pointer"
        >
            <div className="relative rounded-2xl overflow-hidden bg-white/80 border border-primary/10 hover:border-primary/30 transition-all duration-400 hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-1">
                {/* Image */}
                <Link href={`/product/${product.id}`} className="relative h-60 overflow-hidden bg-cream block">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Tag */}
                    <div className="absolute top-3 left-3">
                        <span
                            className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full text-white"
                            style={{ backgroundColor: tagColors[product.tag] || '#DB2777' }}
                        >
                            {product.tag}
                        </span>
                    </div>
                    {/* Discount badge */}
                    {discount > 0 && (
                        <div className="absolute top-3 right-3">
                            <span className="text-[10px] font-bold bg-gold-dark text-white px-2 py-1 rounded-full">
                                -{discount}%
                            </span>
                        </div>
                    )}
                    {/* Wishlist */}
                    <button
                        className="absolute bottom-3 right-3 w-9 h-9 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:border-primary cursor-pointer z-10"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted); }}
                        aria-label="Add to wishlist"
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors ${wishlisted ? 'text-primary fill-primary' : 'text-maroon'}`}
                        />
                    </button>
                </Link>

                <div className="p-4 md:p-5">
                    <p className="text-gold-dark font-inter text-[11px] md:text-xs tracking-widest uppercase font-semibold mb-1">
                        {product.nameMarathi}
                    </p>
                    <Link href={`/product/${product.id}`} className="block">
                        <h3 className="font-playfair text-maroon-dark font-bold text-lg md:text-xl mb-2 leading-tight hover:text-primary transition-colors cursor-pointer">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <span className="font-inter text-xs font-medium text-maroon/70">({product.reviews})</span>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <span className="font-playfair font-bold text-maroon-dark text-2xl">₹{product.price.toLocaleString('en-IN')}</span>
                            <span className="font-inter text-maroon/50 font-medium line-through text-base ml-2">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <Link href={`/product/${product.id}`}>
                            <button className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-inter font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 cursor-pointer">
                                <ShoppingBag className="w-4 h-4" />
                                View
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Bestsellers = () => (
    <section id="bestsellers" className="py-20 md:py-28 bg-heritage-gradient">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Header */}
            <motion.div
                className="text-center mb-14"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <p className="text-gold-dark font-inter text-xs tracking-[0.4em] uppercase font-semibold mb-3">
                    Most Loved
                </p>
                <h2 className="font-playfair text-4xl md:text-5xl text-maroon-dark font-bold mb-4">
                    Bestsellers
                </h2>
                <div className="divider-gold" />
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                ))}
            </div>

            {/* CTA */}
            <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
            >
                <button className="btn-primary font-inter text-sm tracking-widest uppercase px-10">
                    View All Products
                </button>
            </motion.div>
        </div>
    </section>
);

export default Bestsellers;
