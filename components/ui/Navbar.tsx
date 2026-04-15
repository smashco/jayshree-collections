'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import CartDrawer from './CartDrawer';
import Link from 'next/link';

const links = [
    { name: 'Collections', href: '/shop' },
    { name: 'Heritage', href: '/#heritage' },
    { name: 'Bespoke', href: '/#bespoke' },
    { name: 'Contact', href: '/#contact' }
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { totalItems, setIsCartOpen } = useCart();
    const { count: wishlistCount } = useWishlist();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled
                    ? 'bg-black/75 backdrop-blur-2xl border-b border-[#BFA06A]/10 py-4'
                    : 'bg-transparent py-8'
                    }`}
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="max-w-[1400px] mx-auto px-4 md:px-16 flex items-center justify-between">

                    {/* Left: nav links */}
                    <div className="hidden md:flex items-center gap-10">
                        {links.slice(0, 2).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="font-montserrat text-white/90 font-medium text-[0.7rem] md:text-sm tracking-[0.3em] uppercase hover:text-[#BFA06A] transition-all duration-500 relative group cursor-pointer drop-shadow-sm"
                            >
                                {link.name}
                                <span className="absolute -bottom-2 left-0 w-0 h-px bg-[#BFA06A] group-hover:w-full transition-all duration-500" />
                            </Link>
                        ))}
                    </div>

                    {/* Center: Brand */}
                    <Link href="/" className="flex flex-col items-center group">
                        <span
                            className="font-cormorant text-white font-medium tracking-[0.25em] hover:text-[#BFA06A] transition-all duration-700 drop-shadow-md"
                            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', letterSpacing: '0.3em' }}
                        >
                            JAYASHRI
                        </span>
                        <span className="font-montserrat text-[#BFA06A]/90 text-[0.55rem] md:text-[0.65rem] tracking-[0.6em] uppercase font-medium mt-1 drop-shadow-sm">
                            Maison · Est. 1976
                        </span>
                    </Link>

                    {/* Right: nav links + icons */}
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-10">
                            {links.slice(2).map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="font-montserrat text-white/90 font-medium text-[0.7rem] md:text-sm tracking-[0.3em] uppercase hover:text-[#BFA06A] transition-all duration-500 relative group cursor-pointer drop-shadow-sm"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-2 left-0 w-0 h-px bg-[#BFA06A] group-hover:w-full transition-all duration-500" />
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-5">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="text-white/80 hover:text-[#BFA06A] transition-colors duration-400 cursor-pointer drop-shadow-sm"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
                            </button>
                            <Link
                                href="/wishlist"
                                className="relative text-white/80 hover:text-[#BFA06A] transition-colors duration-400 cursor-pointer drop-shadow-sm"
                                aria-label="Wishlist"
                            >
                                <Heart className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 w-4 h-4 md:w-5 md:h-5 bg-[#BFA06A] text-black text-[9px] md:text-xs rounded-full flex items-center justify-center font-bold">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative text-white/80 hover:text-[#BFA06A] transition-colors duration-400 cursor-pointer group drop-shadow-sm"
                                aria-label="Cart"
                            >
                                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1.5 -right-2 w-4 h-4 md:w-5 md:h-5 bg-[#BFA06A] text-black text-[9px] md:text-xs rounded-full flex items-center justify-center font-bold">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                            <button
                                className="md:hidden text-white/80 hover:text-[#BFA06A] transition-colors cursor-pointer drop-shadow-sm"
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="Menu"
                            >
                                {menuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile fullscreen menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
                        animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
                        exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-40 bg-black flex flex-col justify-center items-center"
                    >
                        {/* Gold ambient */}
                        <div className="absolute inset-0 pointer-events-none"
                            style={{ background: 'radial-gradient(circle at center, rgba(191,160,106,0.05) 0%, transparent 70%)' }} />

                        <div className="flex flex-col items-center gap-10 relative z-10">
                            {links.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.08, duration: 0.8 }}
                                    className="font-cormorant text-[#F0E6C2] hover:text-[#BFA06A] transition-colors duration-400 italic"
                                    style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)' }}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.name}
                                </motion.a>
                            ))}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="w-8 h-px bg-[#BFA06A]/30 mt-4"
                            />
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.75 }}
                                className="font-montserrat text-[#BFA06A]/30 text-[0.5rem] tracking-[0.6em] uppercase font-light"
                            >
                                Jayashri Maison · Est. 1976
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search modal */}
            <AnimatePresence>
                {searchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
                            onClick={() => setSearchOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-0 left-0 right-0 z-[61] bg-black border-b border-[#BFA06A]/20 px-6 md:px-16 py-8"
                        >
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="font-montserrat text-[#BFA06A] text-[0.6rem] tracking-[0.4em] uppercase">Search the collection</p>
                                    <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="text-white/60 hover:text-[#BFA06A] cursor-pointer">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <form onSubmit={handleSearch} className="flex items-center gap-4 border-b border-[#BFA06A]/30 pb-4">
                                    <Search className="w-5 h-5 text-[#BFA06A] shrink-0" />
                                    <input
                                        type="text"
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Jhumkas, bridal sets, temple jewellery…"
                                        className="flex-1 bg-transparent outline-none text-white font-cormorant text-2xl md:text-4xl placeholder:text-[#F0E6C2]/20"
                                    />
                                    <button type="submit" className="font-montserrat text-[#BFA06A] text-[0.65rem] tracking-[0.3em] uppercase hover:text-[#D4B580] cursor-pointer shrink-0">
                                        Search →
                                    </button>
                                </form>
                                <p className="font-montserrat text-[#F0E6C2]/30 text-[0.6rem] tracking-[0.2em] uppercase mt-4">Press Enter to search</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <CartDrawer />
        </>
    );
}
