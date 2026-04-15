'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { assetUrl } from '@/lib/assets';
import LazyVideo from '@/components/ui/LazyVideo';
import type { ProductListItem } from '@/lib/products';

const chapters = [
    {
        roman: 'I',
        title: 'The Empress',
        subtitle: 'Harams & Sets',
        description: 'Intricate temple-inspired necklaces, harams & layered sets crafted from 22k gold.',
        count: '48 pieces',
        video: assetUrl('/videos/hero-jewelry.mp4'),
        image: assetUrl('/images/necklace.png'),
        size: 'large',
    },
    {
        roman: 'II',
        title: 'The Chandeliers',
        subtitle: 'Jhumkas',
        description: 'Handcrafted jhumkas, chandeliers & oxidised drops.',
        count: '94 pieces',
        video: assetUrl('/videos/v3.mp4'),
        image: assetUrl('/images/earrings.png'),
        size: 'small',
    },
    {
        roman: 'III',
        title: 'The Circles',
        subtitle: 'Kadas & Bangles',
        description: 'Kolhapuri sets, kundan kadas & bridal stacks.',
        count: '62 pieces',
        video: assetUrl('/videos/v4.mp4'),
        image: assetUrl('/images/bangles.png'),
        size: 'small',
    },
    {
        roman: 'IV',
        title: 'The Crown',
        subtitle: 'Maang Tikkas',
        description: 'Bridal tikkas, passa & matha patti.',
        count: '36 pieces',
        video: assetUrl('/videos/v2.mp4'),
        image: assetUrl('/images/maangtikka.png'),
        size: 'large',
    },
];

function ChapterCard({ chapter, index }: { chapter: typeof chapters[0], index: number }) {
    const isLarge = chapter.size === 'large';
    const ref = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={ref}
            className={`relative overflow-hidden group cursor-pointer ${isLarge ? 'row-span-2' : 'row-span-1'}`}
            style={{ minHeight: isLarge ? 'clamp(320px, 55vw, 640px)' : 'clamp(180px, 35vw, 300px)' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* 1px gold frame — the key 10x detail */}
            <div className="absolute inset-0 border border-[#BFA06A]/20 z-30 pointer-events-none
                            group-hover:border-[#BFA06A]/50 transition-all duration-700" />

            {/* Chapter Roman numeral — vertical, left edge */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <span className="font-cormorant text-[#BFA06A]/30 font-light transition-colors duration-500 group-hover:text-[#BFA06A]/60 drop-shadow-md"
                    style={{
                        fontSize: isLarge ? '7rem' : '4rem',
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        lineHeight: 1,
                    }}>
                    {chapter.roman}
                </span>
            </div>

            {/* Video background with image fallback */}
            <div className="absolute inset-0 bg-black">
                <LazyVideo
                    src={chapter.video}
                    className="w-full h-full object-cover opacity-80 transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
                {/* Dark gradient over video */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
                {/* Gold tint on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: 'linear-gradient(135deg, rgba(191,160,106,0.08) 0%, transparent 60%)' }} />
            </div>

            {/* Content — bottom */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
                {/* Piece count monospaced */}
                <p className="font-montserrat text-[#BFA06A] text-[0.65rem] tracking-[0.4em] uppercase mb-3 font-medium drop-shadow-md">
                    {chapter.count}
                </p>

                {/* Gold accent line — animates on hover */}
                <div className="w-0 group-hover:w-12 h-px bg-[#BFA06A] mb-4 transition-all duration-700 ease-out" />

                {/* Chapter title */}
                <h3
                    className="font-cormorant text-white font-medium leading-none mb-1 drop-shadow-lg"
                    style={{ fontSize: isLarge ? 'clamp(2rem, 4vw, 3.5rem)' : 'clamp(1.4rem, 3vw, 2rem)' }}
                >
                    {chapter.title}
                </h3>

                {/* Subtitle */}
                <p className="font-montserrat text-[#F0E6C2] text-[0.7rem] tracking-[0.35em] uppercase mb-3 font-medium drop-shadow-md">
                    {chapter.subtitle}
                </p>

                {/* Description — only on hover for large */}
                {isLarge && (
                    <p className="font-montserrat text-white text-sm leading-relaxed font-normal max-w-xs mb-5 drop-shadow-md
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-600 translate-y-2 group-hover:translate-y-0">
                        {chapter.description}
                    </p>
                )}

                {/* Explore link */}
                <Link href="/shop" className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer">
                    <span className="font-montserrat text-[#BFA06A] text-[0.55rem] tracking-[0.4em] uppercase font-medium">
                        Explore
                    </span>
                    <div className="w-8 h-px bg-[#BFA06A]" />
                    <span className="text-[#BFA06A] text-xs">→</span>
                </Link>
            </div>
        </motion.div>
    );
}

function FeaturedProductCard({ product, index }: { product: ProductListItem; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/product/${product.slug}`} className="group block">
                <div className="relative overflow-hidden bg-[#0a0a0a] border border-[#BFA06A]/10 group-hover:border-[#BFA06A]/40 transition-all duration-700">
                    <div className="aspect-[3/4] relative overflow-hidden">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                            sizes="(max-width: 768px) 80vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-5">
                        <p className="font-montserrat text-[#BFA06A] text-[0.55rem] tracking-[0.4em] uppercase mb-1">{product.category}</p>
                        <h3 className="font-cormorant text-[#F0E6C2] text-xl font-light leading-snug mb-2">{product.name}</h3>
                        <p className="font-montserrat text-[#BFA06A] text-sm">{product.formattedPrice}</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function FeaturedCollections({ featuredProducts = [] }: { featuredProducts?: ProductListItem[] }) {
    return (
        <section className="bg-black py-16 md:py-28 lg:py-36 relative z-20">

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="font-montserrat text-[#BFA06A]/90 text-[0.55rem] tracking-[0.7em] uppercase font-light mb-5">
                            Jayashri Maison · Curated Collections
                        </p>
                        <h2
                            className="font-cormorant text-[#F0E6C2] font-light leading-none"
                            style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
                        >
                            The <em className="text-[#BFA06A]">Chapters</em>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="font-montserrat text-[#F0E6C2]/80 text-xs leading-relaxed font-light md:max-w-[240px]"
                    >
                        Over 240 handcrafted pieces across 4 signature collections. Each piece, a chapter in Maharashtra&apos;s golden story.
                    </motion.p>
                </div>

                {/* Chapter Slider */}
                <div
                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 w-full"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {chapters.map((chapter, index) => (
                        <div key={chapter.roman} className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[30vw] snap-center shrink-0">
                            <ChapterCard chapter={{ ...chapter, size: 'large' }} index={index} />
                        </div>
                    ))}
                </div>

                {/* Bottom marquee */}
                <div className="overflow-hidden border-t border-[#BFA06A]/10 mt-16 pt-6">
                    <div className="marquee-track">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <span key={i} className="font-montserrat text-[#BFA06A]/20 text-[0.5rem] tracking-[0.6em] uppercase font-light mx-6 shrink-0">
                                Jayashri Maison &nbsp;•&nbsp; Crafted in Maharashtra &nbsp;•&nbsp; Est. 1976 &nbsp;•&nbsp;
                            </span>
                        ))}
                    </div>
                </div>

                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <div className="mt-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-12"
                        >
                            <p className="font-montserrat text-[#BFA06A]/90 text-[0.55rem] tracking-[0.7em] uppercase font-light mb-4">
                                Jayashri Maison · Handpicked
                            </p>
                            <h2
                                className="font-cormorant text-[#F0E6C2] font-light leading-none"
                                style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
                            >
                                Featured <em className="text-[#BFA06A]">Pieces</em>
                            </h2>
                        </motion.div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {featuredProducts.map((product, i) => (
                                <FeaturedProductCard key={product.id} product={product} index={i} />
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-center mt-14"
                >
                    <Link href="/shop" className="btn-gold cursor-pointer inline-flex items-center justify-center">
                        <span>View All 240+ Pieces</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
