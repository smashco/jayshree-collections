'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const collections = [
    {
        id: 1,
        title: 'Necklaces',
        subtitle: 'Temple & Bridal',
        description: 'Intricate temple-inspired necklaces, harams & layered sets',
        color: '#07312A',
        video: '/videos/hero-jewelry.mp4',
        image: '/images/necklace.png',
        count: '48 pieces',
    },
    {
        id: 2,
        title: 'Bangles',
        subtitle: 'Kolhapuri & Bridal',
        description: 'Traditional Kolhapuri sets, kundan bangles & bridal stacks',
        color: '#1A0A12',
        video: '/videos/bangles-reveal.mp4',
        image: '/images/bangles.png',
        count: '62 pieces',
    },
    {
        id: 3,
        title: 'Earrings',
        subtitle: 'Jhumka & Chandelier',
        description: 'Handcrafted jhumkas, chandeliers & oxidised silver drops',
        color: '#0D1A28',
        video: '/videos/earrings-reveal.mp4',
        image: '/images/earrings.png',
        count: '94 pieces',
    },
    {
        id: 4,
        title: 'Maang Tikka',
        subtitle: 'Bridal & Festival',
        description: 'Elaborate bridal tikkas, passa, matha patti & hair jewels',
        color: '#1A1008',
        video: '/videos/hero-jewelry.mp4',
        image: '/images/maangtikka.png',
        count: '36 pieces',
    },
];

function CollectionCard({ item, index }: { item: typeof collections[0], index: number }) {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={ref}
            className="relative h-[80vh] max-h-[700px] overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.01 }}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                style={{ backgroundImage: `url('${item.image}')` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#031411]/95" />
            <div
                className="absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-40"
                style={{ background: `linear-gradient(135deg, ${item.color}cc 0%, transparent 60%)` }}
            />

            {/* Glare effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 30% 20%, rgba(191, 160, 106, 0.12) 0%, transparent 60%)',
                    mixBlendMode: 'color-dodge'
                }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                {/* Piece count */}
                <motion.p
                    className="font-montserrat text-[#BFA06A]/60 text-[0.6rem] tracking-[0.4em] uppercase mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                >
                    {item.count}
                </motion.p>

                {/* Gold accent line */}
                <motion.div
                    className="w-0 group-hover:w-16 h-px bg-[#BFA06A] mb-4 transition-all duration-700 ease-out"
                />

                {/* Title */}
                <h3 className="font-cormorant text-[#F0E6C2] font-light leading-none mb-2"
                    style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                >
                    {item.title}
                </h3>

                <p className="font-montserrat text-[#BFA06A] text-xs tracking-widest uppercase mb-3 font-light">
                    {item.subtitle}
                </p>

                <p className="font-montserrat text-[#F0E6C2]/50 text-xs leading-relaxed font-light max-w-xs mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {item.description}
                </p>

                {/* Explore link */}
                <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="font-montserrat text-[#BFA06A] text-[0.65rem] tracking-[0.3em] uppercase font-medium">
                        Explore
                    </span>
                    <motion.div
                        className="w-6 h-px bg-[#BFA06A] inline-block"
                        animate={{ scaleX: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[#BFA06A] text-sm">→</span>
                </div>
            </div>
        </motion.div>
    );
}

export default function FeaturedCollections() {
    return (
        <section className="bg-[#031411] py-24 md:py-32 relative z-20">

            {/* Gold Marquee Bar at top */}
            <div className="overflow-hidden border-t border-b border-[#BFA06A]/15 py-4 mb-20">
                <div className="marquee-track">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <span key={i} className="font-montserrat text-[#BFA06A]/40 text-xs tracking-[0.5em] uppercase font-light mx-8 shrink-0">
                            Jayshree •&nbsp; Heritage •&nbsp; Crafted •&nbsp; Collection •&nbsp;
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="font-montserrat text-[#BFA06A] text-xs tracking-[0.4em] uppercase font-light mb-4">
                            Curated for You
                        </p>
                        <h2 className="font-cormorant text-[#F0E6C2] font-light leading-none"
                            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
                        >
                            Our <em className="text-[#BFA06A]">Collections</em>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="mt-6 md:mt-0"
                    >
                        <p className="font-montserrat text-[#F0E6C2]/40 text-xs leading-relaxed font-light max-w-xs">
                            Over 240+ handcrafted pieces inspired by Maharashtra's golden heritage, available across 4 signature collections.
                        </p>
                    </motion.div>
                </div>

                {/* Asymmetric Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                    {/* Large card — Necklaces */}
                    <div className="md:col-span-7">
                        <CollectionCard item={collections[0]} index={0} />
                    </div>

                    {/* Small card — Bangles */}
                    <div className="md:col-span-5">
                        <CollectionCard item={collections[1]} index={1} />
                    </div>

                    {/* Small card — Earrings */}
                    <div className="md:col-span-5">
                        <CollectionCard item={collections[2]} index={2} />
                    </div>

                    {/* Large card — Maang Tikka */}
                    <div className="md:col-span-7">
                        <CollectionCard item={collections[3]} index={3} />
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <button className="btn-gold cursor-pointer">
                        <span>View All 240+ Pieces</span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
