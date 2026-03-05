'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Scroll progress bar
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

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [videoLoaded, setVideoLoaded] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const spring = { stiffness: 200, damping: 30 };

    // Beat 1: Brand line fades out early
    const brandOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const brandY = useTransform(scrollYProgress, [0, 0.2], ["0%", "-30%"]);

    // Beat 2: Main title scales + rises
    const titleScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.85]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.35], [1, 1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.35], ["0%", "-20%"]);

    // Beat 3: Video card rises and expands
    const cardScale = useTransform(scrollYProgress, [0.1, 0.4, 1], [0.75, 1, 1.05]);
    const cardOpacity = useTransform(scrollYProgress, [0.05, 0.25, 1], [0, 1, 1]);
    const cardY = useTransform(scrollYProgress, [0.05, 0.4], ["60%", "0%"]);
    const cardRadius = useTransform(scrollYProgress, [0.1, 0.5], [32, 0]);

    // Beat 4: Video overlay text
    const overlayOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);

    return (
        <>
            <ScrollProgressBar />

            {/* Golden ambient glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]"
                    style={{ background: 'radial-gradient(circle, #BFA06A 0%, transparent 70%)' }} />
            </div>

            <div ref={containerRef} className="relative w-full h-[300vh] bg-[#031411]">

                {/* ===== STICKY VIEWPORT ===== */}
                <div className="sticky top-0 w-full h-screen overflow-hidden">

                    {/* --- Beat 1 & 2: Typography Layer --- */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">

                        {/* Brand kicker line */}
                        <motion.p
                            style={{ opacity: brandOpacity, y: brandY }}
                            className="font-montserrat text-[#BFA06A] text-xs md:text-sm tracking-[0.5em] uppercase mb-8 font-light"
                        >
                            Est. 1976 · Maharashtra, India
                        </motion.p>

                        {/* Main Title */}
                        <motion.div
                            style={{ scale: titleScale, opacity: titleOpacity, y: titleY }}
                            className="text-center"
                        >
                            <h1 className="font-cormorant font-light text-[#F0E6C2] leading-none tracking-widest"
                                style={{ fontSize: 'clamp(5rem, 18vw, 16rem)' }}
                            >
                                Jayshree
                            </h1>

                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full h-px bg-gradient-to-r from-transparent via-[#BFA06A]/50 to-transparent mt-6"
                            />

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="font-cormorant italic text-[#BFA06A] text-2xl md:text-4xl mt-6 font-light"
                            >
                                The Art of Heritage
                            </motion.p>
                        </motion.div>

                        {/* Scroll indicator */}
                        <motion.div
                            style={{ opacity: brandOpacity }}
                            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                        >
                            <span className="font-montserrat text-[#BFA06A]/50 text-[0.6rem] tracking-[0.4em] uppercase">Scroll</span>
                            <motion.div
                                className="w-px bg-[#BFA06A]/30"
                                animate={{ height: [16, 40, 16], opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </motion.div>
                    </div>

                    {/* --- Beat 3 & 4: Video Card --- */}
                    <motion.div
                        style={{ scale: cardScale, opacity: cardOpacity, y: cardY }}
                        className="absolute inset-0 flex items-center justify-center z-20 px-4 md:px-16 pointer-events-none"
                    >
                        <motion.div
                            style={{ borderRadius: cardRadius }}
                            className="relative w-full max-w-[90vw] h-[75vh] overflow-hidden border border-[#BFA06A]/20 shadow-[0_60px_120px_rgba(0,0,0,0.9)]"
                        >
                            {/* Video */}
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                onLoadedData={() => setVideoLoaded(true)}
                                className="absolute inset-0 w-full h-full object-cover"
                            >
                                <source src="/videos/hero-jewelry.mp4" type="video/mp4" />
                            </video>

                            {/* Video overlay gradient */}
                            <div className="video-overlay absolute inset-0" />

                            {/* Beat 4: Text overlay on video */}
                            <motion.div
                                style={{ opacity: overlayOpacity }}
                                className="absolute inset-0 flex flex-col justify-end p-12 md:p-20"
                            >
                                <div className="flex items-end justify-between">
                                    <div className="max-w-2xl">
                                        <p className="font-montserrat text-[#BFA06A] text-xs tracking-[0.4em] uppercase mb-4 font-light">
                                            2026 Collection
                                        </p>
                                        <h2 className="font-cormorant text-[#F0E6C2] font-light leading-tight"
                                            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
                                        >
                                            Crafted for Royalty,<br />
                                            <em className="text-[#BFA06A]">Designed for You.</em>
                                        </h2>
                                        <p className="font-montserrat text-[#F0E6C2]/60 text-sm leading-relaxed mt-4 font-light max-w-lg">
                                            Where 50 years of Maharashtrian goldsmithing heritage meets the bold vision of 2026.
                                        </p>
                                    </div>

                                    <div className="hidden md:flex flex-col gap-4 items-end">
                                        <button className="btn-gold-solid cursor-pointer shrink-0">
                                            Discover Collection
                                        </button>
                                        <button className="btn-gold cursor-pointer shrink-0">
                                            <span>Our Heritage</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                </div>
                {/* End sticky viewport */}

            </div>
        </>
    );
}
