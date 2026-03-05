'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface LenisProviderProps {
    children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
    const lenisRef = useRef<any>(null);

    useEffect(() => {
        // Dynamically import Lenis to avoid SSR issues
        import('lenis').then((Lenis) => {
            const lenis = new Lenis.default({
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Math.easeOutExpo
                touchMultiplier: 2,
            });

            lenisRef.current = lenis;

            function raf(time: number) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);
        });

        return () => {
            if (lenisRef.current) {
                lenisRef.current.destroy();
            }
        };
    }, []);

    return <>{children}</>;
}
