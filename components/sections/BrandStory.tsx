'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, Heart, Star } from 'lucide-react';

const stats = [
    { value: '10,000+', label: 'Happy Customers', icon: Heart },
    { value: '200+', label: 'Unique Designs', icon: Sparkles },
    { value: '15+', label: 'Years of Craftsmanship', icon: Star },
];

export default function BrandStory() {
    return (
        <section id="about" className="py-32 bg-[#031411] relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-screen pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0 L70 50 L120 60 L70 70 L60 120 L50 70 L0 60 L50 50Z' fill='%23BFA06A' fill-opacity='1'/%3E%3C/svg%3E")`,
                        backgroundSize: '120px 120px',
                    }}
                />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-center">

                    {/* Image side - Cinematic Split */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="relative overflow-hidden h-[600px] md:h-[800px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-[#BFA06A]/20 bg-[#07312A]">
                            <Image
                                src="https://images.unsplash.com/photo-1599643478514-4a259c1da7cb?q=80&w=2000&auto=format&fit=crop"
                                alt="Maharashtra jewellery tradition"
                                fill
                                className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-[2s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#031411] via-transparent to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#07312A]/80 to-transparent mix-blend-multiply" />
                        </div>

                        {/* Floating gold card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute -bottom-10 -right-6 md:-right-12 bg-[#07312A]/60 backdrop-blur-xl border border-[#BFA06A]/30 p-8 max-w-[280px] shadow-2xl"
                        >
                            <p className="font-samarkan text-[#BFA06A] text-2xl mb-2">Since 2010</p>
                            <p className="font-inter text-[#F0E6C2] text-sm leading-relaxed font-light">
                                Crafting heritage jewellery for the modern vangaurd.
                            </p>
                            <div className="w-12 h-px bg-[#BFA06A] mt-6" />
                        </motion.div>
                    </motion.div>

                    {/* Text side - Elegant Layout */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full lg:w-1/2 lg:pl-10"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-8 h-px bg-[#BFA06A]" />
                            <p className="text-[#BFA06A] font-inter text-xs tracking-[0.4em] uppercase font-semibold">
                                Maison Jayshree
                            </p>
                        </div>

                        <h2 className="font-playfair text-5xl lg:text-7xl text-[#F0E6C2] font-normal leading-tight mb-4">
                            Born from the <br />
                            <span className="text-shimmer-gold italic">Soul of Maharashtra</span>
                        </h2>

                        <div className="divider-luxury my-10" />

                        <div className="space-y-6 max-w-lg">
                            <p className="font-inter text-[#F0E6C2]/80 text-lg leading-relaxed font-light">
                                Jayshree Collections was born in the heart of Vidarbha — where the Paithani silk weave, the
                                Kolhapuri craftsmanship, and ancient temple traditions meet.
                            </p>
                            <p className="font-inter text-[#F0E6C2]/60 text-base leading-relaxed font-light">
                                Every piece is inspired by the women who wear culture with pride — the modern Maharashtrian
                                woman who balances tradition with unwavering confidence. We bring you jewellery that doesn't
                                just adorn you; it speaks your lineage.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-16">
                            {stats.map(({ value, label, icon: Icon }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    className="group border border-[#BFA06A]/10 bg-[#07312A]/20 p-6 hover:bg-[#07312A]/40 transition-colors duration-500"
                                >
                                    <Icon className="w-5 h-5 text-[#BFA06A] mb-4 group-hover:scale-110 transition-transform duration-500" />
                                    <p className="font-playfair text-3xl text-[#F0E6C2] mb-1">{value}</p>
                                    <p className="font-inter text-[#BFA06A] text-xs uppercase tracking-widest">{label}</p>
                                </motion.div>
                            ))}
                        </div>

                        <button className="btn-gold group mt-4">
                            <span>Discover Our Legacy</span>
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
