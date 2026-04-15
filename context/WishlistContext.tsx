'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistItem {
    slug: string;
    name: string;
    price: number;
    formattedPrice: string;
    compareAtPrice: number | null;
    formattedCompareAtPrice: string | null;
    discountPercent: number | null;
    image: string;
    material: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    toggle: (product: WishlistItem) => void;
    remove: (slug: string) => void;
    has: (slug: string) => boolean;
    count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const STORAGE_KEY = 'jayashri_wishlist_v1';

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { setItems(JSON.parse(saved)); } catch { /* ignore */ }
        }
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items, isMounted]);

    const toggle = (product: WishlistItem) => {
        setItems(prev => {
            const exists = prev.find(i => i.slug === product.slug);
            if (exists) return prev.filter(i => i.slug !== product.slug);
            return [...prev, product];
        });
    };

    const remove = (slug: string) => setItems(prev => prev.filter(i => i.slug !== slug));
    const has = (slug: string) => items.some(i => i.slug === slug);

    return (
        <WishlistContext.Provider value={{ items, toggle, remove, has, count: items.length }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
}
