'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = ['Collections', 'Bestsellers', 'About', 'Contact'];

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-[#031411]/80 backdrop-blur-2xl border-b border-[#BFA06A]/10 py-4' : 'bg-transparent py-8'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
                    {/* Brand */}
                    <a href="#" className="flex flex-col items-center group">
                        <span className="font-samarkan text-3xl md:text-4xl text-[#F0E6C2] drop-shadow-[0_0_15px_rgba(191,160,106,0.3)] group-hover:text-shimmer-gold transition-all duration-500">
                            Jayshree
                        </span>
                        <span className="text-[9px] tracking-[0.5em] uppercase text-[#BFA06A] font-inter font-light mt-1">
                            Maison
                        </span>
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-12">
                        {links.map((link) => (
                            <a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                className="text-[#F0E6C2]/70 font-inter font-light text-xs tracking-[0.2em] uppercase hover:text-[#BFA06A] hover:drop-shadow-[0_0_8px_rgba(191,160,106,0.6)] transition-all duration-500 relative group cursor-pointer"
                            >
                                {link}
                                <span className="absolute -bottom-2 left-1/2 w-0 h-px bg-[#BFA06A] group-hover:w-full group-hover:left-0 transition-all duration-500" />
                            </a>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-6">
                        <button className="text-[#F0E6C2] hover:text-[#BFA06A] transition-colors duration-500 cursor-pointer" aria-label="Search">
                            <Search className="w-5 h-5 stroke-[1.5]" />
                        </button>
                        <button className="relative text-[#F0E6C2] hover:text-[#BFA06A] transition-colors duration-500 cursor-pointer group" aria-label="Cart">
                            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                            <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#BFA06A] text-[#031411] text-[9px] rounded-full flex items-center justify-center font-bold font-inter group-hover:scale-110 transition-transform">
                                2
                            </span>
                        </button>
                        <button
                            className="md:hidden text-[#F0E6C2] hover:text-[#BFA06A] transition-colors duration-500 cursor-pointer"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menu"
                        >
                            {menuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-40 bg-[#031411] flex flex-col justify-center items-center"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,160,106,0.1)_0%,transparent_100%)] pointer-events-none" />

                        <div className="flex flex-col items-center gap-8 relative z-10 w-full px-8">
                            {links.map((link, i) => (
                                <motion.a
                                    key={link}
                                    href={`#${link.toLowerCase()}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                                    className="text-4xl font-playfair text-[#F0E6C2] hover:text-[#BFA06A] transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <span className="italic">{link}</span>
                                </motion.a>
                            ))}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="w-12 h-px bg-[#BFA06A]/30 mt-8"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
