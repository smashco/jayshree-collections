'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { assetUrl } from '@/lib/assets';

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

// Subcomponent to use hooks correctly
function ChapterItem({ ch, index, progress }: { ch: string; index: number; progress: MotionValue<number> }) {
    const scaleX = useTransform(progress, [index * 0.2, index * 0.2 + 0.05], [0, 1]);
    return (
        <motion.div className="flex items-center gap-2">
            <motion.div
                className="w-3 h-px bg-[#BFA06A]"
                style={{ scaleX }}
            />
            <span className="font-cormorant text-[#BFA06A]/30 text-[0.6rem] font-light">{ch}</span>
        </motion.div>
    );
}

// Roman numeral chapter indicators on right edge
function ChapterIndicator({ progress }: { progress: MotionValue<number> }) {
    const chapters = ['I', 'II', 'III', 'IV', 'V'];

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-4 items-center pointer-events-none hidden md:flex">
            {/* Est line */}
            <div className="absolute -left-16 top-0 -translate-y-full">
                <p className="font-montserrat text-[#BFA06A]/40 text-[0.5rem] tracking-[0.4em] uppercase"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    Est. 1976
                </p>
            </div>
            {chapters.map((ch, i) => (
                <ChapterItem key={ch} ch={ch} index={i} progress={progress} />
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
                            className="font-montserrat text-[#BFA06A] text-[0.6rem] tracking-[0.7em] uppercase font-light mb-10"
                        >
                            Jayshree Collections
                        </motion.p>

                        {/* Main title block */}
                        <motion.div
                            style={{ scale: titleScale, opacity: titleOpacity, y: titleY }}
                            className="text-center"
                        >
                            <p className="font-cormorant text-[#F0E6C2]/90 font-light italic tracking-widest text-2xl md:text-4xl mb-3">
                                The Art of
                            </p>
                            <h1 className="font-cormorant text-[#BFA06A] font-light italic leading-none tracking-[0.05em]"
                                style={{ fontSize: 'clamp(3.5rem, 20vw, 18rem)', lineHeight: 0.9 }}
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
                                className="font-montserrat text-[#BFA06A] text-[0.7rem] md:text-xs tracking-[0.3em] uppercase font-medium drop-shadow-md"
                            >
                                Part One: Our Jewelry ↓
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
                            className="relative w-full max-w-[92vw] h-[65vh] md:h-[78vh] overflow-hidden shadow-[0_80px_160px_rgba(0,0,0,1)]"
                        >
                            {/* 1px gold frame */}
                            <div className="absolute inset-0 border border-[#BFA06A]/25 z-30 pointer-events-none" style={{ borderRadius: 'inherit' }} />

                            {/* Main hero video — v2.mp4 (necklace light shaft) */}
                            <video
                                autoPlay loop muted playsInline
                                preload="auto"
                                className="absolute inset-0 w-full h-full object-cover"
                            >
                                <source src={assetUrl('/videos/v2.mp4')} type="video/mp4" />
                            </video>

                            {/* Gradient overlay */}
                            <div className="video-overlay absolute inset-0 bg-black/40" />

                            {/* Beat 4: Video text overlay */}
                            <motion.div
                                style={{ opacity: overlayOpacity, y: overlayY }}
                                className="absolute inset-0 flex flex-col justify-end p-5 md:p-10 lg:p-16"
                            >
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
                                    <div className="max-w-xl">
                                        {/* Chapter label */}
                                        <div className="flex items-center gap-4 mb-4 md:mb-6">
                                            <div className="w-10 h-[2px] bg-[#BFA06A]" />
                                            <span className="font-montserrat text-[#BFA06A] text-[0.7rem] md:text-sm tracking-[0.3em] uppercase font-semibold drop-shadow-md">
                                                Chapter I
                                            </span>
                                        </div>
                                        <h2 className="font-cormorant text-white font-medium leading-tight drop-shadow-xl"
                                            style={{ fontSize: 'clamp(2rem, 5.5vw, 5.5rem)' }}>
                                            Made for Royalty,<br />
                                            <em className="text-[#BFA06A] drop-shadow-lg">Made for You.</em>
                                        </h2>
                                        <p className="font-montserrat text-white text-sm md:text-base leading-relaxed mt-3 md:mt-5 font-medium max-w-lg drop-shadow-lg">
                                            Where 10 years of jewelry making tradition meets modern design.
                                        </p>
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-2 md:gap-3 shrink-0 mt-4 md:mt-0">
                                        <button className="btn-gold-solid cursor-pointer text-xs tracking-[0.1em] font-medium px-8 py-3">
                                            See Collection
                                        </button>
                                        <button className="btn-gold cursor-pointer px-8 py-3 bg-black/60 backdrop-blur-md">
                                            <span className="text-xs tracking-[0.1em] font-medium text-white">Our Story</span>
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
