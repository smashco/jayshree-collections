'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Step-by-step parallax animations
    const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const cardScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);
    const cardY = useTransform(scrollYProgress, [0, 0.5, 1], ["20%", "0%", "-20%"]);
    const cardOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 1, 1]);

    return (
        <div ref={containerRef} className="relative w-full h-[200vh] bg-[#031411]">
            {/* 3D WebGL Background Layer - Fixed while scrolling */}
            <div className="sticky top-0 w-full h-screen z-0 opacity-40 mix-blend-screen pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#031411] via-transparent to-[#031411] z-10" />
                <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
            </div>

            {/* Hero Typography - Step 1 */}
            <motion.div
                style={{ y: titleY, opacity: titleOpacity }}
                className="absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-10 pointer-events-none"
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="text-center"
                >
                    <p className="font-playfair italic text-[#BFA06A] text-2xl md:text-3xl lg:text-4xl mb-6">
                        The Art of Heritage
                    </p>
                    <h1 className="font-samarkan text-[6rem] md:text-[8rem] lg:text-[12rem] text-[#F0E6C2] drop-shadow-[0_0_50px_rgba(191,160,106,0.2)] tracking-wider leading-none">
                        Jayshree
                    </h1>
                    <div className="w-px h-24 bg-gradient-to-b from-[#BFA06A] to-transparent mx-auto mt-12 origin-top" />
                </motion.div>
            </motion.div>

            {/* Video Expansion Card - Step 2 */}
            <motion.div
                style={{ scale: cardScale, y: cardY, opacity: cardOpacity }}
                className="absolute top-screen w-full h-screen flex items-center justify-center z-20 px-4 md:px-12"
            >
                <div className="relative w-full max-w-7xl aspect-video rounded-3xl overflow-hidden glass-premium shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-[#BFA06A]/30">
                    {/* High-End Jewelry Video */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] hover:scale-105"
                    >
                        <source src="/videos/hero-jewelry.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#031411]/20 to-[#031411]/90" />

                    <div className="absolute bottom-0 left-0 w-full p-12 md:p-20 flex justify-between items-end">
                        <div className="max-w-2xl">
                            <h2 className="font-playfair text-4xl md:text-6xl text-white mb-6">
                                Crafted for Royalty, Designed for You.
                            </h2>
                            <p className="font-inter text-[#F0E6C2]/80 text-lg font-light tracking-wide">
                                Witness the breathtaking intersection of Maharashtrian tradition and modern avant-garde design.
                            </p>
                        </div>
                        <button className="btn-gold shrink-0 hidden md:block group cursor-pointer">
                            <span>Discover Collection</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
