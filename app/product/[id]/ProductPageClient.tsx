'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useCart, CartProduct } from '@/context/CartContext';
import { ProductDetail, ProductListItem } from '@/lib/products';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ReviewSection from '@/components/ui/ReviewSection';
import Link from 'next/link';

interface ProductPageClientProps {
    product: ProductDetail;
    relatedProducts: ProductListItem[];
}

type MediaItem = ProductDetail['images'][number];

function MediaViewer({ media }: { media: MediaItem }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    if (media.mediaType === 'video') {
        return (
            <video
                ref={videoRef}
                key={media.url}
                src={media.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
            />
        );
    }
    return (
        <Image
            key={media.url}
            src={media.url}
            alt={media.alt || ''}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
        />
    );
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);

    const allMedia: MediaItem[] = product.images.length > 0
        ? product.images
        : [{ id: 'fallback', url: product.image, alt: product.name, isPrimary: true, mediaType: 'image' }];

    const primaryIndex = allMedia.findIndex(m => m.isPrimary && m.mediaType === 'image');
    const [activeIndex, setActiveIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);
    const activeMedia = allMedia[activeIndex];

    const displayPrice = selectedVariant?.formattedPrice || product.formattedPrice;
    const stock = selectedVariant?.stock ?? 0;
    const outOfStock = stock <= 0;

    // Reset quantity when variant changes
    useEffect(() => { setQuantity(1); }, [selectedVariant?.id]);

    const handleAddToCart = () => {
        if (!selectedVariant || outOfStock || quantity > stock) return;
        const cartProduct: CartProduct = {
            slug: product.slug,
            name: product.name,
            price: selectedVariant.price,
            formattedPrice: selectedVariant.formattedPrice,
            compareAtPrice: product.compareAtPrice,
            image: product.image,
            material: product.material,
            variantId: selectedVariant.id,
            variantName: selectedVariant.name,
        };
        addToCart(cartProduct, quantity);
    };

    return (
        <main className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <section className="flex-1 pt-32 pb-20 md:pt-48 md:pb-32 relative z-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">

                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 font-montserrat text-[#F0E6C2]/70 text-[11px] md:text-xs tracking-widest uppercase mb-12 font-medium">
                        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
                        <span>/</span>
                        <Link href={`/shop?category=${product.category}`} className="hover:text-white transition-colors">{product.category}</Link>
                        <span>/</span>
                        <span className="text-[#BFA06A] drop-shadow-sm">{product.name}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-32">

                        {/* Media Gallery */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex gap-4"
                        >
                            {/* Thumbnails — vertical strip */}
                            {allMedia.length > 1 && (
                                <div className="flex flex-col gap-2 w-16 shrink-0">
                                    {allMedia.map((media, i) => (
                                        <button
                                            key={media.id}
                                            onClick={() => setActiveIndex(i)}
                                            className={`relative w-16 aspect-[4/5] border overflow-hidden shrink-0 cursor-pointer transition-all duration-300
                                                ${activeIndex === i ? 'border-[#BFA06A]' : 'border-[#BFA06A]/15 opacity-50 hover:opacity-100'}`}
                                        >
                                            {media.mediaType === 'video' ? (
                                                <div className="w-full h-full bg-[#111] flex items-center justify-center">
                                                    <span className="text-[#BFA06A] text-lg">▶</span>
                                                </div>
                                            ) : (
                                                <Image src={media.url} alt={media.alt || ''} fill className="object-cover" sizes="64px" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main viewer */}
                            <div className="relative flex-1 aspect-[4/5] md:aspect-auto md:h-[600px] lg:h-[800px] bg-[#0A0A0A] border border-[#BFA06A]/10 overflow-hidden">
                                <MediaViewer media={activeMedia} />
                                {activeMedia.mediaType === 'video' && (
                                    <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1">
                                        <span className="font-montserrat text-[#BFA06A] text-[0.55rem] tracking-widest uppercase">Video</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col justify-center"
                        >
                            <p className="font-montserrat text-[#BFA06A] text-xs md:text-sm tracking-[0.3em] uppercase mb-4 font-semibold drop-shadow-sm">{product.material}</p>
                            <h1 className="font-cormorant text-white font-medium leading-none mb-6 drop-shadow-md" style={{ fontSize: 'clamp(3rem, 5vw, 5.5rem)' }}>
                                {product.name}
                            </h1>
                            <div className="flex items-baseline flex-wrap gap-4 mb-10">
                                <p className="font-montserrat text-[#BFA06A] text-2xl md:text-3xl tracking-widest font-medium drop-shadow-sm">{displayPrice}</p>
                                {product.formattedCompareAtPrice && (
                                    <>
                                        <p className="font-montserrat text-[#F0E6C2]/40 text-lg md:text-xl line-through">
                                            {product.formattedCompareAtPrice}
                                        </p>
                                        {product.discountPercent && (
                                            <span className="bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.15em] uppercase font-bold px-3 py-1">
                                                {product.discountPercent}% Off
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            <p className="font-montserrat text-[#F0E6C2]/90 text-sm md:text-base leading-relaxed font-medium mb-12 max-w-xl">{product.description}</p>

                            {/* Variant Selector */}
                            {product.variants.length > 1 && (
                                <div className="mb-8">
                                    <p className="font-montserrat text-[#F0E6C2]/70 text-xs tracking-[0.2em] uppercase mb-3 font-medium">Variant</p>
                                    <div className="flex flex-wrap gap-3">
                                        {product.variants.map((v) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVariant(v)}
                                                className={`font-montserrat text-xs tracking-widest uppercase px-4 py-2 border transition-colors cursor-pointer
                                                    ${selectedVariant?.id === v.id
                                                        ? 'border-[#BFA06A] text-[#BFA06A] bg-[#BFA06A]/10'
                                                        : 'border-[#BFA06A]/20 text-[#F0E6C2]/70 hover:border-[#BFA06A]/50'
                                                    }`}
                                            >
                                                {v.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-y border-[#BFA06A]/15 py-8 mb-10">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="flex items-center justify-between border border-[#BFA06A]/30 px-6 py-4 sm:w-1/3">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={outOfStock} className="text-[#F0E6C2]/70 hover:text-[#BFA06A] transition-colors text-lg md:text-xl disabled:opacity-30">-</button>
                                        <span className="font-montserrat text-white font-medium text-lg">{quantity}</span>
                                        <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} disabled={outOfStock || quantity >= stock} className="text-[#F0E6C2]/70 hover:text-[#BFA06A] transition-colors text-lg md:text-xl disabled:opacity-30">+</button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!selectedVariant || outOfStock}
                                        className="btn-gold flex-1 justify-center text-xs md:text-sm tracking-[0.25em] font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <span>{outOfStock ? 'Out of Stock' : !selectedVariant ? 'Unavailable' : 'Add to Bag'}</span>
                                    </button>
                                </div>
                                {selectedVariant && (
                                    <p className={`font-montserrat text-xs mt-3 ${stock <= 3 && stock > 0 ? 'text-amber-400' : stock <= 0 ? 'text-red-400' : 'text-[#F0E6C2]/40'}`}>
                                        {stock <= 0 ? 'Currently out of stock' : stock <= 3 ? `Only ${stock} left in stock` : `${stock} in stock`}
                                    </p>
                                )}
                            </div>

                            {selectedVariant && (
                                <p className={`font-montserrat text-xs tracking-widest uppercase mb-6 font-medium ${selectedVariant.stock > 5 ? 'text-green-400/70' : selectedVariant.stock > 0 ? 'text-amber-400/70' : 'text-red-400/70'}`}>
                                    {selectedVariant.stock > 5 ? 'In Stock' : selectedVariant.stock > 0 ? `Only ${selectedVariant.stock} left` : 'Out of Stock'}
                                </p>
                            )}

                            <div className="flex flex-col gap-6 font-montserrat text-xs md:text-sm text-[#F0E6C2]/90 font-medium">
                                {['Shipping & Returns', 'Craftsmanship Guarantee', 'Bespoke Options'].map((item) => (
                                    <div key={item} className="flex justify-between items-center py-4 border-b border-[#BFA06A]/10 cursor-pointer group">
                                        <span className="uppercase tracking-widest group-hover:text-[#BFA06A] transition-colors">{item}</span>
                                        <span className="text-lg">+</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Reviews */}
                    <ReviewSection productId={product.id} />

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="border-t border-[#BFA06A]/15 pt-24">
                            <h2 className="font-cormorant text-white text-5xl font-medium text-center mb-16 drop-shadow-md">
                                Related <em className="text-[#BFA06A] drop-shadow-sm">Pieces</em>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {relatedProducts.map((p, i) => (
                                    <motion.div key={p.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }}>
                                        <Link href={`/product/${p.slug}`} className="group block">
                                            <div className="relative aspect-[4/5] bg-[#111] mb-6 border border-[#BFA06A]/10 overflow-hidden">
                                                {p.discountPercent && (
                                                    <div className="absolute top-3 left-3 z-30 bg-[#BFA06A] text-black font-montserrat text-[0.6rem] tracking-[0.15em] uppercase font-bold px-2.5 py-1">
                                                        {p.discountPercent}% Off
                                                    </div>
                                                )}
                                                <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-cormorant text-white text-xl font-medium mb-2 group-hover:text-[#BFA06A] transition-colors drop-shadow-sm">{p.name}</h3>
                                                <div className="flex items-baseline justify-center gap-2">
                                                    <p className="font-montserrat text-[#BFA06A] text-sm md:text-base tracking-widest font-medium">{p.formattedPrice}</p>
                                                    {p.formattedCompareAtPrice && (
                                                        <p className="font-montserrat text-[#F0E6C2]/40 text-xs line-through">{p.formattedCompareAtPrice}</p>
                                                    )}
                                                </div>
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
