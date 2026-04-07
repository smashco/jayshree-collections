'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartProduct {
    slug: string;
    name: string;
    price: number;
    formattedPrice: string;
    image: string;
    material: string;
    variantId: string;
    variantName: string;
}

export interface CartItem extends CartProduct {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: CartProduct, quantity?: number) => void;
    removeFromCart: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'jayshree_cart_v2';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Load from local storage on mount, clean invalid items
    useEffect(() => {
        let loaded: CartItem[] = [];

        const savedCart = localStorage.getItem(CART_KEY);
        if (savedCart) {
            try {
                loaded = JSON.parse(savedCart);
            } catch {
                console.error('Failed to parse cart');
            }
        } else {
            // Migrate from old format
            const oldCart = localStorage.getItem('jayshree_cart');
            if (oldCart) {
                try {
                    const oldItems = JSON.parse(oldCart);
                    loaded = oldItems.map((item: Record<string, unknown>) => ({
                        slug: item.id || item.slug,
                        name: item.name,
                        price: item.price,
                        formattedPrice: item.formattedPrice,
                        image: item.image,
                        material: item.material,
                        variantId: item.variantId || '',
                        variantName: item.variantName || 'Default',
                        quantity: item.quantity || 1,
                    }));
                    localStorage.removeItem('jayshree_cart');
                } catch {
                    console.error('Failed to migrate old cart');
                }
            }
        }

        // Remove items with missing variantId — they can't be checked out
        const valid = loaded.filter(item => item.variantId);
        if (valid.length !== loaded.length) {
            localStorage.setItem(CART_KEY, JSON.stringify(valid));
        }
        setItems(valid);
        setTimeout(() => setIsMounted(true), 0);
    }, []);

    // Save to local storage when items change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem(CART_KEY, JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addToCart = (product: CartProduct, quantity: number = 1) => {
        setItems(prev => {
            const key = product.variantId || product.slug;
            const existingItem = prev.find(item => (item.variantId || item.slug) === key);
            if (existingItem) {
                return prev.map(item =>
                    (item.variantId || item.slug) === key
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (variantId: string) => {
        setItems(prev => prev.filter(item => (item.variantId || item.slug) !== variantId));
    };

    const updateQuantity = (variantId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(variantId);
            return;
        }
        setItems(prev => prev.map(item =>
            (item.variantId || item.slug) === variantId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            subtotal,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
