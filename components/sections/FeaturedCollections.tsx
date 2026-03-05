'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const collections = [
    {
        id: 'necklace',
        name: 'Paithani Necklaces',
        nameMarathi: 'पैठणी गळ्यातले',
        description: 'Temple-inspired chokers & layered sets crafted in pure gold tones.',
        image: '/images/necklace.png',
        count: '48 designs',
        badge: 'Bestseller',
    },
    {
        id: 'earrings',
        name: 'Jhumka Earrings',
        nameMarathi: 'जड झुमके',
        description: 'Filigree jhumkas & chandelier drops for the perfect royal finish.',
        image: '/images/earrings.png',
        count: '62 designs',
        badge: 'New',
    },
    {
        id: 'bangles',
        name: 'Kolhapuri Bangles',
        nameMarathi: 'कोल्हापुरी बांगडी',
        description: 'Enamel & oxidized gold-tone bangles rooted in deep tradition.',
        image: '/images/bangles.png',
        count: '35 designs',
        badge: 'Limited',
    },
    {
        id: 'maangtikka',
        name: 'Bridal Maang Tikka',
        nameMarathi: 'मांग टिका',
        description: 'Kundan & pearl bridal sets to crown your most auspicious days.',
        image: '/images/maangtikka.png',
        count: '24 designs',
        badge: 'Exclusive',
    },
];

const badgeColors: Record<string, string> = {
    Bestseller: 'bg-[#BFA06A] text-[#031411]',
    New: 'bg-[#F0E6C2] text-[#07312A]',
    Limited: 'bg-[#490C1E] text-[#F0E6C2]',
    Exclusive: 'bg-[#07312A] text-[#BFA06A]',
};

export default function FeaturedCollections() {
    return (
        <section id="collections" className="py-32 bg-[#031411] relative z-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(191,160,106,0.05)_0%,transparent_50%)]" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
                {/* Header */}
                <motion.div
                    className="flex flex-col md:flex-row items-end justify-between mb-24"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="max-w-2xl">
                        <p className="text-[#BFA06A] font-inter text-xs tracking-[0.4em] uppercase font-semibold mb-6">
                            Curated Collections
                        </p>
                        <h2 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-[#F0E6C2] font-normal leading-tight">
                            The Royal <br /><span className="text-[#BFA06A] italic">Archives</span>
                        </h2>
                    </div>

                    <div className="mt-8 md:mt-0 text-right hidden lg:block">
                        <p className="text-[#F0E6C2]/60 font-inter text-lg max-w-sm ml-auto">
                            Each signature piece is a love letter to the courts of Maharashtra — tradition reborn for the modern vanguard.
                        </p>
                    </div>
                </motion.div>

                {/* Premium 3D Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {collections.map((col, i) => (
                        <motion.div
                            key={col.id}
                            initial={{ opacity: 0, scale: 0.95, y: 100 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="card-3d group cursor-pointer h-[500px]"
                        >
                            <div className="card-3d-inner w-full h-full relative rounded-2xl overflow-hidden bg-[#07312A]/40 border border-[#BFA06A]/20">

                                {/* Holographic Glare Overlay */}
                                <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[linear-gradient(105deg,transparent_20%,rgba(191,160,106,0.1)_25%,transparent_30%)] mix-blend-color-dodge pointer-events-none" />

                                {/* Badge */}
                                <div className="absolute top-6 left-6 z-40">
                                    <span className={`text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full ${badgeColors[col.badge]} shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}>
                                        {col.badge}
                                    </span>
                                </div>

                                {/* Image */}
                                <div className="absolute inset-0 z-10 overflow-hidden">
                                    <Image
                                        src={col.image}
                                        alt={col.name}
                                        fill
                                        className="object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-70 group-hover:opacity-90 grayscale-[20%] group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#031411] via-[#031411]/50 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 w-full p-8 md:p-10 z-40 flex flex-col justify-end">
                                    <div className="transform transition-transform duration-700 group-hover:-translate-y-4">
                                        <p className="text-[#BFA06A] font-inter text-xs tracking-[0.3em] font-medium mb-3">{col.nameMarathi}</p>
                                        <h3 className="font-playfair text-3xl md:text-4xl text-[#F0E6C2] mb-4">{col.name}</h3>

                                        <p className="text-[#F0E6C2]/60 font-inter text-sm mb-6 max-w-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 h-0 group-hover:h-auto overflow-hidden">
                                            {col.description}
                                        </p>

                                        <div className="flex items-center justify-between border-t border-[#BFA06A]/20 pt-6 mt-2">
                                            <span className="text-[#F0E6C2]/40 font-inter text-xs tracking-widest uppercase">{col.count}</span>
                                            <button className="flex items-center gap-3 text-[#BFA06A] font-inter text-xs tracking-widest uppercase font-semibold group/btn">
                                                <span>View Gallery</span>
                                                <div className="w-8 h-8 rounded-full border border-[#BFA06A]/30 flex items-center justify-center group-hover/btn:bg-[#BFA06A] group-hover/btn:text-[#031411] transition-colors duration-300">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
