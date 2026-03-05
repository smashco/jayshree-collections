'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const steps = [
    {
        number: '01',
        title: 'Design & Sketch',
        description: 'Every piece begins as a dream on paper. Our artisans sketch intricate motifs inspired by temple carvings, nature, and Maharashtra\'s royal history.',
    },
    {
        number: '02',
        title: 'Casting & Moulding',
        description: 'Metal is melted, cast, and carefully shaped into the primary structure. Each piece passes through 14 quality checkpoints before moving forward.',
    },
    {
        number: '03',
        title: 'Stone Setting',
        description: 'Kundan, polki, and glass stones are hand-set with precision tools. This stage alone can take a full day for a single intricate necklace.',
    },
    {
        number: '04',
        title: 'Final Polish',
        description: 'The finished piece is buffed to a mirror gold finish, quality inspected, and photographed before being lovingly packaged for you.',
    },
];

export default function ProcessSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={containerRef} className="relative bg-[#031411] py-32 overflow-hidden z-20">

            {/* Background video ambient */}
            <div className="absolute inset-0 opacity-15">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="/videos/process-reveal.mp4" type="video/mp4" />
                    <source src="/videos/hero-jewelry.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[#031411]/70" />
            </div>

            {/* Gold glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
                    style={{ background: 'radial-gradient(ellipse, rgba(191,160,106,0.04) 0%, transparent 70%)' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="text-center mb-20">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="font-montserrat text-[#BFA06A] text-xs tracking-[0.4em] uppercase font-light mb-4"
                    >
                        How We Create
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="font-cormorant text-[#F0E6C2] font-light leading-tight"
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                    >
                        The Art of the <em className="text-[#BFA06A]">Craft</em>
                    </motion.h2>
                    <div className="divider-luxury mx-auto mt-6" />
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative border-l border-[#BFA06A]/15 first:border-l-0 md:first:border-l px-8 py-10"
                        >
                            {/* Number */}
                            <p className="font-cormorant text-[#BFA06A]/20 font-light leading-none mb-6 transition-colors duration-500 group-hover:text-[#BFA06A]/40"
                                style={{ fontSize: 'clamp(4rem, 8vw, 7rem)' }}
                            >
                                {step.number}
                            </p>

                            {/* Gold accent dot */}
                            <div className="w-2 h-2 rounded-full bg-[#BFA06A] mb-6 transition-transform duration-500 group-hover:scale-150" />

                            <h3 className="font-cormorant text-[#F0E6C2] text-2xl font-light mb-4">
                                {step.title}
                            </h3>

                            <p className="font-montserrat text-[#F0E6C2]/45 text-xs leading-relaxed font-light">
                                {step.description}
                            </p>

                            {/* Hover highlight */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                style={{ background: 'linear-gradient(135deg, rgba(191,160,106,0.03) 0%, transparent 70%)' }} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
