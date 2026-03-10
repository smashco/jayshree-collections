'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { getProductById, getRelatedProducts } from '@/lib/catalog';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export default function ProductPageClient({ id }: { id: string }) {
    const product = getProductById(id);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const relatedProducts = getRelatedProducts(product.category, product.id);

    return (
        <main className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 md:pt-48 md:pb-32 relative z-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">

                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 font-montserrat text-[#F0E6C2]/50 text-[10px] tracking-widest uppercase mb-12">
                        <Link href="/shop" className="hover:text-[#BFA06A] transition-colors">Shop</Link>
                        <span>/</span>
                        <Link href={`/shop?category=${product.category}`} className="hover:text-[#BFA06A] transition-colors">{product.category}</Link>
                        <span>/</span>
                        <span className="text-[#BFA06A]">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-32">
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative aspect-[4/5] md:aspect-auto md:h-[600px] lg:h-[800px] bg-[#0A0A0A] border border-[#BFA06A]/10 overflow-hidden"
                        >
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </motion.div>

                        {/* Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col justify-center"
                        >
                            <p className="font-montserrat text-[#BFA06A]/80 text-xs tracking-[0.3em] uppercase mb-4">{product.material}</p>
                            <h1 className="font-cormorant text-[#F0E6C2] font-light leading-none mb-6" style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)' }}>
                                {product.name}
                            </h1>
                            <p className="font-montserrat text-[#BFA06A] text-xl tracking-widest font-light mb-10">{product.formattedPrice}</p>
                            <p className="font-montserrat text-[#F0E6C2]/70 text-sm leading-relaxed font-light mb-12 max-w-xl">{product.description}</p>

                            <div className="border-y border-[#BFA06A]/15 py-8 mb-10">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="flex items-center justify-between border border-[#BFA06A]/30 px-6 py-4 sm:w-1/3">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#F0E6C2]/50 hover:text-[#BFA06A] transition-colors">-</button>
                                        <span className="font-montserrat text-[#F0E6C2]">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="text-[#F0E6C2]/50 hover:text-[#BFA06A] transition-colors">+</button>
                                    </div>
                                    <button onClick={() => addToCart(product, quantity)} className="btn-gold flex-1 justify-center text-[0.65rem] tracking-[0.25em]">
                                        <span>Add to Bag</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 font-montserrat text-xs text-[#F0E6C2]/60 font-light">
                                {['Shipping & Returns', 'Craftsmanship Guarantee', 'Bespoke Options'].map((item) => (
                                    <div key={item} className="flex justify-between items-center py-4 border-b border-[#BFA06A]/10 cursor-pointer group">
                                        <span className="uppercase tracking-widest group-hover:text-[#BFA06A] transition-colors">{item}</span>
                                        <span>+</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="border-t border-[#BFA06A]/15 pt-24">
                            <h2 className="font-cormorant text-[#F0E6C2] text-4xl font-light text-center mb-16">
                                Related <em className="text-[#BFA06A]">Pieces</em>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {relatedProducts.map((p, i) => (
                                    <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }}>
                                        <Link href={`/product/${p.id}`} className="group block">
                                            <div className="relative aspect-[4/5] bg-[#111] mb-6 border border-[#BFA06A]/10 overflow-hidden">
                                                <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-cormorant text-[#F0E6C2] text-lg font-light mb-2 group-hover:text-[#BFA06A] transition-colors">{p.name}</h3>
                                                <p className="font-montserrat text-[#BFA06A] text-xs tracking-widest">{p.formattedPrice}</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
