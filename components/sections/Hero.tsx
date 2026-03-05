'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });
    return (
        <motion.div
            className="scroll-progress"
            style={{ scaleX, width: '100%' }}
        />
    );
}

// Roman numeral chapter indicators on right edge
function ChapterIndicator({ progress }: { progress: any }) {
    const chapters = ['I', 'II', 'III', 'IV', 'V'];
    const activeIndex = useTransform(progress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 1, 2, 3, 4, 4]);

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 items-center pointer-events-none">
            {/* Est line */}
            <div className="absolute -left-16 top-0 -translate-y-full">
                <p className="font-montserrat text-[#BFA06A]/40 text-[0.5rem] tracking-[0.4em] uppercase"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    Est. 1976
                </p>
            </div>
            {chapters.map((ch, i) => (
                <motion.div key={ch} className="flex items-center gap-2">
                    <motion.div
                        className="w-3 h-px bg-[#BFA06A]"
                        style={{ scaleX: useTransform(progress, [i * 0.2, i * 0.2 + 0.05], [0, 1]) }}
                    />
                    <span className="font-cormorant text-[#BFA06A]/30 text-[0.6rem] font-light">{ch}</span>
                </motion.div>
            ))}
        </div>
    );
}

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    // Beat 1: Brand elements fade early
    const brandOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
    const brandY = useTransform(scrollYProgress, [0, 0.15], ['0%', '-20%']);

    // Beat 2: Title scaling + fade
    const titleScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.88]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.12, 0.3], [1, 1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.3], ['0%', '-15%']);

    // Gold line width
    const lineWidth = useTransform(scrollYProgress, [0, 0.1], ['0%', '80%']);

    // Beat 3: Video card rises and expands
    const cardScale = useTransform(scrollYProgress, [0.08, 0.38, 1], [0.7, 1, 1.04]);
    const cardOpacity = useTransform(scrollYProgress, [0.04, 0.22, 1], [0, 1, 1]);
    const cardY = useTransform(scrollYProgress, [0.04, 0.38], ['65%', '0%']);
    const cardRadius = useTransform(scrollYProgress, [0.08, 0.48], [24, 0]);

    // Beat 4: Video overlay text
    const overlayOpacity = useTransform(scrollYProgress, [0.42, 0.62], [0, 1]);
    const overlayY = useTransform(scrollYProgress, [0.42, 0.65], ['30px', '0px']);

    return (
        <>
            <ScrollProgressBar />

            {/* Left edge: Est. 1976 vertical text */}
            <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 pointer-events-none hidden md:block">
                <p className="font-montserrat text-[#BFA06A]/35 text-[0.5rem] tracking-[0.5em] uppercase"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    Est. 1976 · Maharashtra · India
                </p>
            </div>

            {/* Right edge: Chapter indicators */}
            <ChapterIndicator progress={scrollYProgress} />

            {/* Ambient glow pulse */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(191,160,106,0.04) 0%, transparent 70%)' }}
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div ref={containerRef} className="relative w-full h-[320vh] bg-[#000000]">

                {/* STICKY VIEWPORT */}
                <div className="sticky top-0 w-full h-screen overflow-hidden">

                    {/* ── Beat 1 & 2: Typography ── */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-6">

                        {/* Kicker */}
                        <motion.p
                            style={{ opacity: brandOpacity, y: brandY }}
                            className="font-montserrat text-[#BFA06A]/60 text-[0.6rem] tracking-[0.7em] uppercase font-light mb-10"
                        >
                            Maison · Jayshree Collections
                        </motion.p>

                        {/* Main title block */}
                        <motion.div
                            style={{ scale: titleScale, opacity: titleOpacity, y: titleY }}
                            className="text-center"
                        >
                            <p className="font-cormorant text-[#F0E6C2]/50 font-light italic tracking-widest text-2xl md:text-4xl mb-3">
                                The Art of
                            </p>
                            <h1 className="font-cormorant text-[#BFA06A] font-light italic leading-none tracking-[0.05em]"
                                style={{ fontSize: 'clamp(5rem, 20vw, 18rem)', lineHeight: 0.9 }}
                            >
                                Heritage
                            </h1>

                            {/* Animated hairline */}
                            <motion.div
                                style={{ width: lineWidth }}
                                className="h-px bg-gradient-to-r from-transparent via-[#BFA06A]/60 to-transparent mx-auto mt-8 mb-6"
                            />

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 2, delay: 1.2 }}
                                className="font-montserrat text-[#BFA06A]/50 text-[0.6rem] tracking-[0.5em] uppercase font-light"
                            >
                                Chapter One: The Collection ↓
                            </motion.p>
                        </motion.div>

                        {/* Scroll cue */}
                        <motion.div
                            style={{ opacity: brandOpacity }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                        >
                            <motion.div
                                className="w-px bg-[#BFA06A]/30"
                                animate={{ height: [12, 40, 12], opacity: [0.2, 0.7, 0.2] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </motion.div>
                    </div>

                    {/* ── Beat 3 & 4: Video Card ── */}
                    <motion.div
                        style={{ scale: cardScale, opacity: cardOpacity, y: cardY }}
                        className="absolute inset-0 flex items-center justify-center z-20 px-4 md:px-12 lg:px-24 pointer-events-none"
                    >
                        <motion.div
                            style={{ borderRadius: cardRadius }}
                            className="relative w-full max-w-[92vw] h-[78vh] overflow-hidden shadow-[0_80px_160px_rgba(0,0,0,1)]"
                        >
                            {/* 1px gold frame */}
                            <div className="absolute inset-0 border border-[#BFA06A]/25 z-30 pointer-events-none" style={{ borderRadius: 'inherit' }} />

                            {/* Main hero video — v2.mp4 (necklace light shaft) */}
                            <video
                                autoPlay loop muted playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                            >
                                <source src="/videos/v2.mp4" type="video/mp4" />
                                <source src="/videos/hero-jewelry.mp4" type="video/mp4" />
                            </video>

                            {/* Gradient overlay */}
                            <div className="video-overlay absolute inset-0" />

                            {/* Beat 4: Video text overlay */}
                            <motion.div
                                style={{ opacity: overlayOpacity, y: overlayY }}
                                className="absolute inset-0 flex flex-col justify-end p-10 md:p-16 lg:p-20"
                            >
                                <div className="flex items-end justify-between gap-8">
                                    <div className="max-w-xl">
                                        {/* Chapter label */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-8 h-px bg-[#BFA06A]/60" />
                                            <span className="font-montserrat text-[#BFA06A]/70 text-[0.55rem] tracking-[0.5em] uppercase font-light">
                                                Chapter I
                                            </span>
                                        </div>
                                        <h2 className="font-cormorant text-[#F0E6C2] font-light leading-tight"
                                            style={{ fontSize: 'clamp(2rem, 4.5vw, 4.5rem)' }}>
                                            Crafted for Royalty,<br />
                                            <em className="text-[#BFA06A]">Designed for You.</em>
                                        </h2>
                                        <p className="font-montserrat text-[#F0E6C2]/50 text-xs leading-relaxed mt-4 font-light max-w-md">
                                            Where 50 years of Maharashtrian goldsmithing heritage meets the bold vision of 2026.
                                        </p>
                                    </div>

                                    <div className="hidden md:flex flex-col gap-3 shrink-0">
                                        <button className="btn-gold-solid cursor-pointer text-[0.65rem] tracking-[0.25em]">
                                            Discover Collection
                                        </button>
                                        <button className="btn-gold cursor-pointer">
                                            <span className="text-[0.65rem] tracking-[0.25em]">Our Heritage</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </>
    );
}
