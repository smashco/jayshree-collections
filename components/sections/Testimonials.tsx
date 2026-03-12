'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Priya Kulkarni',
        location: 'Pune, Maharashtra',
        rating: 5,
        review: 'The quality is unreal for the price. The Paithani necklace set is my absolute favourite. True heritage reimagined.',
        avatar: 'PK',
        occasion: 'Navratri 2024',
    },
    {
        id: 2,
        name: 'Sneha Bhosale',
        location: 'Nagpur, Maharashtra',
        rating: 5,
        review: 'The bridal maang tikka I ordered for my sister\'s wedding was breathtaking. Every guest thought it was real gold! Packaging was also so beautiful.',
        avatar: 'SB',
        occasion: 'Wedding Season',
    },
    {
        id: 3,
        name: 'Anjali Deshmukh',
        location: 'Nashik, Maharashtra',
        rating: 5,
        review: 'Authentic Maharashtrian designs at such affordable prices. The jhumkas I bought have become my everyday signature piece.',
        avatar: 'AD',
        occasion: 'Everyday Wear',
    },
    {
        id: 4,
        name: 'Meena Patil',
        location: 'Aurangabad, Maharashtra',
        rating: 5,
        review: 'The Kolhapuri bangles are worth every rupee. Already recommended to all my friends and family. Absolutely regal.',
        avatar: 'MP',
        occasion: 'Diwali Gift',
    },
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

    return (
        <section className="py-16 md:py-32 bg-[#031411] relative overflow-hidden z-20">
            {/* Decorative */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#BFA06A]/50 to-transparent" />

            <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className="text-[#BFA06A] font-inter text-[0.8rem] md:text-sm tracking-[0.4em] uppercase font-bold mb-6 drop-shadow-sm">
                        Customer Stories
                    </p>
                    <h2 className="font-playfair text-4xl md:text-5xl lg:text-7xl text-[#F0E6C2] font-normal mb-8">
                        Her Voice, Her <span className="text-[#BFA06A] italic">Legacy</span>
                    </h2>
                    <div className="divider-luxury mx-auto" />
                </motion.div>

                {/* Carousel */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-[#07312A]/40 backdrop-blur-xl border border-[#BFA06A]/20 p-6 md:p-10 lg:p-16 text-center max-w-3xl mx-auto relative shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                        >
                            {/* Quote icon */}
                            <Quote className="w-12 h-12 text-[#BFA06A]/30 mx-auto mb-8" aria-hidden />

                            <p className="font-playfair text-[#F0E6C2] text-3xl md:text-4xl italic leading-relaxed mb-10 font-normal drop-shadow-md">
                                &quot;{testimonials[current].review}&quot;
                            </p>

                            {/* Stars */}
                            <div className="flex justify-center gap-2 mb-8">
                                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-[#BFA06A] fill-[#BFA06A]" />
                                ))}
                            </div>

                            {/* Author */}
                            <div className="flex justify-center items-center gap-6">
                                <div className="text-right">
                                    <p className="font-playfair text-2xl md:text-3xl text-[#F0E6C2] font-medium drop-shadow-sm">{testimonials[current].name}</p>
                                    <p className="font-inter text-[#F0E6C2]/90 text-sm md:text-base tracking-widest uppercase mt-2 font-medium">
                                        {testimonials[current].location}
                                    </p>
                                </div>
                                <div className="w-px h-10 bg-[#BFA06A]/30" />
                                <div className="text-left">
                                    <p className="font-inter text-[#BFA06A] text-sm md:text-base font-bold tracking-widest uppercase drop-shadow-sm">
                                        {testimonials[current].occasion}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Nav Buttons — below card on mobile, floating on desktop */}
                    <div className="flex md:block">
                        <button
                            onClick={prev}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 rounded-full border border-[#BFA06A]/30 items-center justify-center hover:bg-[#BFA06A] hover:text-[#031411] text-[#BFA06A] transition-colors duration-500 cursor-pointer bg-[#031411]"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 rounded-full border border-[#BFA06A]/30 items-center justify-center hover:bg-[#BFA06A] hover:text-[#031411] text-[#BFA06A] transition-colors duration-500 cursor-pointer bg-[#031411]"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile nav row */}
                    <div className="flex md:hidden justify-center gap-6 mt-8">
                        <button
                            onClick={prev}
                            className="w-12 h-12 rounded-full border border-[#BFA06A]/30 flex items-center justify-center hover:bg-[#BFA06A] hover:text-[#031411] text-[#BFA06A] transition-colors duration-500 cursor-pointer bg-[#031411]"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="w-12 h-12 rounded-full border border-[#BFA06A]/30 flex items-center justify-center hover:bg-[#BFA06A] hover:text-[#031411] text-[#BFA06A] transition-colors duration-500 cursor-pointer bg-[#031411]"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-3 mt-16">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`transition-all duration-500 cursor-pointer ${i === current ? 'w-12 h-px bg-[#BFA06A]' : 'w-4 h-px bg-[#BFA06A]/30 hover:bg-[#BFA06A]/60'
                                }`}
                            aria-label={`Go to testimonial ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
