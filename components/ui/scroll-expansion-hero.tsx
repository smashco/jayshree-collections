'use client';

import {
    useEffect,
    useRef,
    useState,
    ReactNode,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
    mediaType?: 'video' | 'image';
    mediaSrc: string;
    mobileMediaSrc?: string; // New prop for mobile video
    posterSrc?: string;
    bgImageSrc: string;
    title?: string;
    date?: string;
    scrollToExpand?: string;
    textBlend?: boolean;
    children?: ReactNode;
}

const ScrollExpandMedia = ({
    mediaType = 'video',
    mediaSrc,
    mobileMediaSrc,
    posterSrc,
    bgImageSrc,
    title,
    date,
    scrollToExpand,
    textBlend,
    children,
}: ScrollExpandMediaProps) => {
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const [showContent, setShowContent] = useState<boolean>(false);
    const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
    const [touchStartY, setTouchStartY] = useState<number>(0);
    const [isMobileState, setIsMobileState] = useState<boolean>(false);

    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setScrollProgress(0);
        setShowContent(false);
        setMediaFullyExpanded(false);
    }, [mediaType]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
                setMediaFullyExpanded(false);
                e.preventDefault();
            } else if (!mediaFullyExpanded) {
                e.preventDefault();
                const scrollDelta = e.deltaY * 0.0009;
                const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
                setScrollProgress(newProgress);
                if (newProgress >= 1) {
                    setMediaFullyExpanded(true);
                    setShowContent(true);
                } else if (newProgress < 0.75) {
                    setShowContent(false);
                }
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            setTouchStartY(e.touches[0].clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStartY) return;
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
                setMediaFullyExpanded(false);
                e.preventDefault();
            } else if (!mediaFullyExpanded) {
                e.preventDefault();
                const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
                const scrollDelta = deltaY * scrollFactor;
                const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
                setScrollProgress(newProgress);
                if (newProgress >= 1) {
                    setMediaFullyExpanded(true);
                    setShowContent(true);
                } else if (newProgress < 0.75) {
                    setShowContent(false);
                }
                setTouchStartY(touchY);
            }
        };

        const handleTouchEnd = (): void => {
            setTouchStartY(0);
        };

        const handleScroll = (): void => {
            if (!mediaFullyExpanded) {
                window.scrollTo(0, 0);
            }
        };

        window.addEventListener('wheel', handleWheel as unknown as EventListener, { passive: false });
        window.addEventListener('scroll', handleScroll as EventListener);
        window.addEventListener('touchstart', handleTouchStart as unknown as EventListener, { passive: false });
        window.addEventListener('touchmove', handleTouchMove as unknown as EventListener, { passive: false });
        window.addEventListener('touchend', handleTouchEnd as EventListener);

        return () => {
            window.removeEventListener('wheel', handleWheel as unknown as EventListener);
            window.removeEventListener('scroll', handleScroll as EventListener);
            window.removeEventListener('touchstart', handleTouchStart as unknown as EventListener);
            window.removeEventListener('touchmove', handleTouchMove as unknown as EventListener);
            window.removeEventListener('touchend', handleTouchEnd as EventListener);
        };
    }, [scrollProgress, mediaFullyExpanded, touchStartY]);

    useEffect(() => {
        const checkIfMobile = (): void => {
            setIsMobileState(window.innerWidth < 768);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
    const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
    const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

    const firstWord = title ? title.split(' ')[0] : '';
    const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

    // Choose active video source based on mobile state
    const activeMediaSrc = isMobileState && mobileMediaSrc ? mobileMediaSrc : mediaSrc;

    return (
        <div ref={sectionRef} className="transition-colors duration-700 ease-in-out overflow-x-hidden">
            <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
                <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
                    {/* Background */}
                    <motion.div
                        className="absolute inset-0 z-0 h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 - scrollProgress }}
                        transition={{ duration: 0.1 }}
                    >
                        <Image
                            src={bgImageSrc}
                            alt="Background"
                            width={1920}
                            height={1080}
                            className="w-screen h-screen object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </motion.div>

                    {/* Main content */}
                    <div className="container mx-auto flex flex-col items-center justify-start relative z-10 w-full">
                        <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
                            {/* Expanding media */}
                            <div
                                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[2rem] overflow-hidden"
                                style={{
                                    width: `${mediaWidth}px`,
                                    height: `${mediaHeight}px`,
                                    maxWidth: '95vw',
                                    maxHeight: '85vh',
                                    boxShadow: `0 0 100px rgba(212,175,55,${0.2 + scrollProgress * 0.4}), 0 20px 60px rgba(0,0,0,0.5)`,
                                    transition: 'box-shadow 0.3s ease',
                                }}
                            >
                                {mediaType === 'video' ? (
                                    <div className="relative w-full h-full pointer-events-none">
                                        <video
                                            key={activeMediaSrc} // Force re-render on src change
                                            src={activeMediaSrc}
                                            poster={posterSrc}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            preload="auto"
                                            className="w-full h-full object-cover"
                                            controls={false}
                                        />
                                        <motion.div
                                            className="absolute inset-0 bg-black/30 rounded-[2rem]"
                                            initial={{ opacity: 0.7 }}
                                            animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={activeMediaSrc}
                                            alt={title || 'Media content'}
                                            width={1280}
                                            height={720}
                                            className="w-full h-full object-cover"
                                            priority
                                        />
                                        <motion.div
                                            className="absolute inset-0 bg-black/40 rounded-[2rem]"
                                            initial={{ opacity: 0.7 }}
                                            animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                )}

                                {/* Gold shimmer border on expand */}
                                <motion.div
                                    className="absolute inset-0 rounded-[2rem] pointer-events-none"
                                    animate={{ opacity: scrollProgress > 0.3 ? 1 : 0 }}
                                    style={{
                                        background: `linear-gradient(to right, transparent, rgba(212,175,55,${scrollProgress * 0.4}), transparent)`,
                                        border: `2px solid rgba(212,175,55,${scrollProgress * 0.8})`,
                                    }}
                                />
                            </div>

                            {/* Floating text - Top Left */}
                            <motion.div
                                className="absolute top-32 left-8 md:left-16 z-20 text-left pointer-events-none"
                                animate={{ opacity: 1 - scrollProgress * 1.5, x: -(scrollProgress * 100) }}
                            >
                                <p className="font-playfair italic text-gold text-2xl md:text-3xl mb-2">Heritage</p>
                                <p className="font-inter text-yellow-100/60 uppercase tracking-[0.3em] font-light text-xs md:text-sm">Of Maharashtra</p>
                            </motion.div>

                            {/* Floating text - Bottom Right */}
                            <motion.div
                                className="absolute bottom-32 right-8 md:right-16 z-20 text-right pointer-events-none hidden md:block"
                                animate={{ opacity: 1 - scrollProgress * 1.5, x: scrollProgress * 100 }}
                            >
                                <p className="font-playfair italic text-gold text-2xl md:text-3xl mb-2">Luxury</p>
                                <p className="font-inter text-yellow-100/60 uppercase tracking-[0.3em] font-light text-xs md:text-sm">Redefined</p>
                            </motion.div>

                            {/* Scroll hint */}
                            <div className="flex flex-col items-center text-center absolute bottom-12 z-10 w-full mb-4 md:mb-0">
                                {date && (
                                    <p
                                        className="text-lg text-yellow-200 font-medium tracking-widest uppercase pb-2"
                                        style={{ transform: `translateX(-${textTranslateX}vw)`, transition: 'none' }}
                                    >
                                        {date}
                                    </p>
                                )}
                                {scrollToExpand && (
                                    <div
                                        className="flex flex-col items-center justify-center pointer-events-none"
                                        style={{ opacity: 1 - scrollProgress * 3 }}
                                    >
                                        <p className="text-yellow-200/80 font-inter text-[10px] md:text-xs uppercase tracking-[0.4em] mb-3">
                                            {scrollToExpand}
                                        </p>
                                        <motion.div
                                            className="w-px h-12 bg-gradient-to-b from-gold/80 to-transparent"
                                            animate={{ scaleY: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Title text */}
                            <div
                                className={`flex items-center justify-center text-center gap-4 md:gap-8 w-full relative z-10 flex-col md:flex-row pointer-events-none ${textBlend ? 'mix-blend-overlay' : 'mix-blend-normal'
                                    }`}
                            >
                                <motion.h1
                                    className="font-samarkan text-7xl sm:text-8xl md:text-[8rem] lg:text-[10rem] text-[#FDF2F8] drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] leading-tight tracking-wider"
                                    style={{ transform: `translateX(-${textTranslateX}vw)`, transition: 'none' }}
                                >
                                    {firstWord}
                                </motion.h1>
                                <motion.h2
                                    className="font-samarkan text-7xl sm:text-8xl md:text-[8rem] lg:text-[10rem] text-[#FDF2F8] drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] leading-tight tracking-wider"
                                    style={{ transform: `translateX(${textTranslateX}vw)`, transition: 'none' }}
                                >
                                    {restOfTitle}
                                </motion.h2>
                            </div>
                        </div>

                        {/* Content revealed after expansion */}
                        <motion.section
                            className="flex flex-col w-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showContent ? 1 : 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            {children}
                        </motion.section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ScrollExpandMedia;
