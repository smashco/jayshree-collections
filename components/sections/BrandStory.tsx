'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { assetUrl } from '@/lib/assets';
import LazyVideo from '@/components/ui/LazyVideo';

const milestones = [
    { year: '2016', label: 'Founded in Maharashtra by Jayshree Bhoir' },
    { year: '2021', label: 'Expansion across Thane and Mumbai' },
    { year: '2026', label: 'Lakhs of happy customers across the state' },
];

const stats = [
    { number: '10', unit: 'Years', label: 'of Heritage' },
    { number: '10K+', unit: 'Pieces', label: 'Crafted by Hand' },
    { number: '1L+', unit: 'Customers', label: 'Satisfied' },
];

export default function BrandStory() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });
    const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);
    const textY = useTransform(scrollYProgress, [0, 1], ['25px', '-25px']);

    return (
        <section ref={containerRef} className="relative bg-black overflow-hidden z-20">

            <div className="divider-full" />

            {/* Chapter label */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-20">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="flex items-center gap-4 mb-0"
                >
                    <span className="font-cormorant text-[#BFA06A]/20 font-light"
                        style={{ fontSize: '5rem', lineHeight: 1 }}>V</span>
                    <div>
                        <p className="font-montserrat text-[#BFA06A] text-[0.65rem] md:text-[0.7rem] tracking-[0.4em] uppercase font-medium drop-shadow-sm">
                            Part V · The Story
                        </p>
                        <p className="font-cormorant text-[#F0E6C2]/90 text-xl font-light italic">
                            A Story of Art
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Sharp split layout — NO rounded corners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh] mt-0">

                {/* Left — Full cinematic video */}
                <div className="relative overflow-hidden min-h-[45vh] lg:min-h-full">
                    <motion.div style={{ scale: imageScale }} className="absolute inset-0">
                        <LazyVideo
                            src={assetUrl('/videos/v5.mp4')}
                            className="w-full h-full object-cover"
                        />
                        {/* Right-side fade to black — seamless merge with text panel */}
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to right, transparent 50%, #000000 100%)' }} />
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to bottom, transparent 60%, #000000 100%)' }} />
                    </motion.div>

                    {/* Floating glass badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        className="absolute bottom-6 left-4 md:bottom-10 md:left-8 glass-premium p-3 md:p-5"
                        style={{ maxWidth: '160px' }}
                    >
                        <p className="font-cormorant text-[#BFA06A] font-medium" style={{ fontSize: '4rem', lineHeight: 1 }}>10</p>
                        <p className="font-montserrat text-[#F0E6C2] text-xs md:text-sm tracking-widest uppercase mt-2 font-medium drop-shadow-md">Years of Heritage</p>
                    </motion.div>
                </div>

                {/* Right — Sticky text panel */}
                <div className="flex flex-col justify-center px-5 md:px-14 lg:px-16 py-12 md:py-20">
                    <motion.div style={{ y: textY }}>

                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                            className="font-cormorant text-[#F0E6C2] font-light leading-tight mb-8"
                            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
                        >
                            A Story of<br />
                            <em className="text-[#BFA06A]">Jewelry Art</em>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="font-montserrat text-white text-sm md:text-base leading-relaxed font-medium mb-14 max-w-md drop-shadow-md"
                        >
                            For 10 years, Jayshree Collections has kept Maharashtrian jewelry making alive. Every piece mixes old traditions with new designs — made by hand by our best jewelry makers.
                        </motion.p>

                        {/* Gold timeline */}
                        <div className="relative pl-5 mb-12">
                            <motion.div
                                initial={{ scaleY: 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute left-0 top-0 bottom-0 w-px origin-top"
                                style={{ background: 'linear-gradient(to bottom, #BFA06A, rgba(191,160,106,0.1))' }}
                            />
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={m.year}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.4 + i * 0.15 }}
                                    className="flex items-start gap-5 mb-8 last:mb-0 relative"
                                >
                                    <div className="absolute -left-5 top-2 w-2 h-2 rounded-full bg-[#BFA06A] -translate-x-[3px]" />
                                    <div>
                                        <span className="font-cormorant text-[#BFA06A] text-2xl md:text-3xl font-medium drop-shadow-sm">{m.year}</span>
                                        <p className="font-montserrat text-white text-xs md:text-sm font-medium mt-1 leading-relaxed drop-shadow-sm">{m.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="btn-gold-solid cursor-pointer"
                            style={{ display: 'inline-block' }}
                        >
                            Read Our Story
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="border-t border-[#BFA06A]/10 py-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
                    <div className="grid grid-cols-3 gap-4">
                        {stats.map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: i * 0.12 }}
                                className="text-center border-r border-[#BFA06A]/10 last:border-0"
                            >
                                <p className="counter-display">{s.number}</p>
                                <p className="font-montserrat text-[#BFA06A] text-[0.65rem] md:text-[0.75rem] tracking-[0.3em] uppercase font-medium mt-2 drop-shadow-sm">{s.unit}</p>
                                <p className="font-montserrat text-white text-[0.7rem] md:text-sm mt-2 font-medium drop-shadow-sm">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="divider-full" />
        </section>
    );
}
