'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const milestones = [
    { year: '1976', label: 'Founded in Pune by Jayshree Bhoir' },
    { year: '2001', label: 'First bridal collection launched across Maharashtra' },
    { year: '2026', label: '50 years · 10,000+ pieces · One living legacy' },
];

const stats = [
    { number: '50', unit: 'Years', label: 'of Unbroken Heritage' },
    { number: '10K+', unit: 'Pieces', label: 'Crafted by Hand' },
    { number: '8', unit: 'Awards', label: 'of Excellence' },
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
                        <p className="font-montserrat text-[#BFA06A]/90 text-[0.55rem] tracking-[0.6em] uppercase font-light">
                            Chapter V · The Story
                        </p>
                        <p className="font-cormorant text-[#F0E6C2]/90 text-xl font-light italic">
                            A Legacy of Craftsmanship
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Sharp split layout — NO rounded corners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh] mt-0">

                {/* Left — Full cinematic video */}
                <div className="relative overflow-hidden min-h-[45vh] lg:min-h-full">
                    <motion.div style={{ scale: imageScale }} className="absolute inset-0">
                        <video
                            autoPlay loop muted playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/videos/v5.mp4" type="video/mp4" />
                        </video>
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
                        <p className="font-cormorant text-[#BFA06A] font-light" style={{ fontSize: '3.5rem', lineHeight: 1 }}>50</p>
                        <p className="font-montserrat text-[#F0E6C2]/90 text-[0.55rem] tracking-widest uppercase mt-1 font-light">Years of Heritage</p>
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
                            A Legacy of<br />
                            <em className="text-[#BFA06A]">Craftsmanship</em>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="font-montserrat text-[#F0E6C2]/80 text-xs leading-relaxed font-light mb-14 max-w-sm"
                        >
                            For half a century, Jayshree Collections has been the guardian of Maharashtrian jewelry artistry. Each piece is a conversation between ancient tradition and living, breathing craft — hammered, cast, and finished by generations of skilled artisans.
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
                                        <span className="font-cormorant text-[#BFA06A] text-xl font-light">{m.year}</span>
                                        <p className="font-montserrat text-[#F0E6C2]/75 text-[0.65rem] font-light mt-0.5 leading-relaxed">{m.label}</p>
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
                                <p className="font-montserrat text-[#BFA06A]/90 text-[0.55rem] tracking-[0.35em] uppercase font-light mt-1">{s.unit}</p>
                                <p className="font-montserrat text-[#F0E6C2]/60 text-[0.6rem] mt-1.5 font-light">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="divider-full" />
        </section>
    );
}
