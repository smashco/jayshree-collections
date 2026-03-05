'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const milestones = [
    { year: '1976', label: 'Founded in Pune by Jayshree Bhoir' },
    { year: '2001', label: 'First bridal collection launched' },
    { year: '2026', label: '50 years, 10,000+ pieces, 1 legacy' },
];

const stats = [
    { number: '50', unit: 'Years', label: 'of Heritage' },
    { number: '10K+', unit: 'Pieces', label: 'Crafted with Love' },
    { number: '8', unit: 'Awards', label: 'of Excellence' },
];

export default function BrandStory() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.0]);
    const textY = useTransform(scrollYProgress, [0, 1], ['30px', '-30px']);

    return (
        <section ref={containerRef} className="relative bg-[#07312A] overflow-hidden z-20">

            {/* Top divider */}
            <div className="divider-full" />

            {/* ===== Chapter 1: The Split ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

                {/* Left — Cinematic Image panel */}
                <div className="relative overflow-hidden min-h-[50vh] lg:min-h-screen">
                    <motion.div
                        style={{ scale: imageScale }}
                        className="absolute inset-0"
                    >
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/videos/brand-story.mp4" type="video/mp4" />
                            {/* Fallback */}
                        </video>

                        {/* Fallback gradient if video fails */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#07312A] via-[#BFA06A]/10 to-[#031411]"
                            style={{ mixBlendMode: 'multiply' }} />

                        {/* Image overlay */}
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to right, transparent 0%, #07312A 100%)' }} />
                    </motion.div>

                    {/* Floating stat badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-12 left-8 md:left-12 glass-premium p-6 max-w-[220px]"
                    >
                        <p className="font-cormorant text-[#BFA06A] text-5xl font-light leading-none">50</p>
                        <p className="font-montserrat text-[#F0E6C2]/70 text-xs tracking-widest uppercase mt-1 font-light">Years of Heritage</p>
                    </motion.div>
                </div>

                {/* Right — Sticky text panel */}
                <div className="relative flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 lg:py-0">

                    <motion.div style={{ y: textY }}>
                        {/* Kicker */}
                        <motion.p
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="font-montserrat text-[#BFA06A] text-xs tracking-[0.4em] uppercase font-light mb-6"
                        >
                            Our Story
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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
                            className="font-montserrat text-[#F0E6C2]/60 text-sm leading-relaxed font-light mb-12 max-w-md"
                        >
                            For half a century, Jayshree Collections has been the guardian of Maharashtrian jewelry artistry. Each piece is a conversation between ancient tradition and living, breathing craft — hammered, cast, and finished by generations of skilled artisans.
                        </motion.p>

                        {/* Gold timeline */}
                        <div className="relative pl-6 mb-12">
                            {/* Vertical line */}
                            <motion.div
                                initial={{ scaleY: 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#BFA06A] via-[#BFA06A]/50 to-transparent origin-top"
                            />

                            {milestones.map((m, i) => (
                                <motion.div
                                    key={m.year}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.4 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex items-start gap-6 mb-8 last:mb-0 relative"
                                >
                                    {/* Dot */}
                                    <div className="absolute -left-6 top-1 w-2 h-2 rounded-full bg-[#BFA06A] -translate-x-[3px]" />

                                    <div>
                                        <span className="font-cormorant text-[#BFA06A] text-2xl font-light">
                                            {m.year}
                                        </span>
                                        <p className="font-montserrat text-[#F0E6C2]/60 text-xs font-light mt-1">
                                            {m.label}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="btn-gold-solid inline-block cursor-pointer"
                            style={{ width: 'fit-content' }}
                        >
                            Read Our Story
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* ===== Chapter 2: Stats Row ===== */}
            <div className="border-t border-[#BFA06A]/15 py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
                        {stats.map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className="text-center md:border-r md:last:border-0 border-[#BFA06A]/15"
                            >
                                <p className="counter-display">{s.number}</p>
                                <p className="font-montserrat text-[#BFA06A] text-xs tracking-[0.3em] uppercase font-light mt-1">
                                    {s.unit}
                                </p>
                                <p className="font-montserrat text-[#F0E6C2]/40 text-xs mt-2 font-light">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Temple motif gold border */}
            <div className="divider-full" />
        </section>
    );
}
