'use client';

import { motion } from 'framer-motion';

const steps = [
    {
        number: '01',
        title: 'Design & Sketch',
        description: 'Every piece begins as a dream on paper. Our artisans sketch intricate motifs inspired by temple carvings, nature, and Maharashtra\'s royal history.',
    },
    {
        number: '02',
        title: 'Casting & Moulding',
        description: 'Metal is melted, cast, and carefully shaped. Each primary structure passes through 14 quality checkpoints before moving forward.',
    },
    {
        number: '03',
        title: 'Stone Setting',
        description: 'Kundan, polki, and glass stones are hand-set with precision. This stage alone can take a full day for a single intricate necklace.',
    },
    {
        number: '04',
        title: 'The Final Polish',
        description: 'Buffed to a mirror gold finish, quality inspected, and lovingly packaged. Only then does it leave our hands.',
    },
];

export default function ProcessSection() {
    return (
        <section className="relative bg-black py-20 md:py-32 overflow-hidden z-20">

            {/* Background: v6.mp4 (artisan hands) at very low opacity */}
            <div className="absolute inset-0">
                <video
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover opacity-10"
                >
                    <source src="/videos/v6.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {/* Subtle gold radial */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(191,160,106,0.03) 0%, transparent 70%)' }} />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                    >
                        <p className="font-montserrat text-[#BFA06A]/90 text-[0.55rem] tracking-[0.7em] uppercase font-light mb-5">
                            Chapter VI · The Making
                        </p>
                        <h2
                            className="font-cormorant text-[#F0E6C2] font-light leading-tight"
                            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                        >
                            The Art of the <em className="text-[#BFA06A]">Craft</em>
                        </h2>
                    </motion.div>
                    <div className="divider-luxury hidden md:block" style={{ width: '80px' }} />
                </div>

                {/* Steps — 4 columns with vertical 1px separator */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative md:border-l border-[#BFA06A]/10 first:border-0 px-5 md:px-8 py-8 md:py-10 hover:bg-[#BFA06A]/[0.02] transition-colors duration-700 border-t md:border-t-0 first:border-t-0"
                        >
                            {/* Large muted step number */}
                            <p className="font-cormorant text-[#BFA06A]/12 font-light leading-none mb-8 transition-colors duration-500 group-hover:text-[#BFA06A]/20"
                                style={{ fontSize: 'clamp(4rem, 7vw, 6rem)' }}
                            >
                                {step.number}
                            </p>

                            {/* Gold dot */}
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BFA06A]/60 mb-5 transition-all duration-500 group-hover:bg-[#BFA06A] group-hover:shadow-[0_0_12px_rgba(191,160,106,0.6)]" />

                            <h3 className="font-cormorant text-[#F0E6C2] font-light mb-4" style={{ fontSize: '1.4rem' }}>
                                {step.title}
                            </h3>

                            <p className="font-montserrat text-[#F0E6C2]/80 text-[0.7rem] leading-relaxed font-light">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom: video showcase of the artisan at work */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-20 relative overflow-hidden border border-[#BFA06A]/15"
                    style={{ height: '50vh', maxHeight: '480px' }}
                >
                    <video
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/videos/v6.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />

                    {/* Overlay text */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                        <p className="font-montserrat text-[#BFA06A]/90 text-[0.55rem] tracking-[0.6em] uppercase font-light mb-4">
                            50 Years
                        </p>
                        <h3 className="font-cormorant text-[#F0E6C2] font-light italic"
                            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                            &quot;Every piece is a prayer<br />
                            <em className="text-[#BFA06A]">in gold.&quot;</em>
                        </h3>
                        <p className="font-montserrat text-[#F0E6C2]/70 text-[0.6rem] tracking-widest uppercase mt-4 font-light">
                            — Jayshree Bhoir, Founder
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
