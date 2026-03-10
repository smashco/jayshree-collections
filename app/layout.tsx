import type { Metadata } from "next";
import LenisProvider from "@/components/providers/LenisProvider";
import { CartProvider } from "@/context/CartContext";
import { Cormorant, Montserrat } from 'next/font/google';
import "./globals.css";

const cormorant = Cormorant({
    subsets: ['latin'],
    variable: '--font-cormorant',
    weight: ['300', '400', '500', '600', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    weight: ['200', '300', '400', '500', '600', '700'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Jayshree Collections — 2026 Luxury Edition",
    description: "Discover handcrafted imitation jewellery inspired by the rich heritage of Maharashtra. Paithani-inspired necklaces, temple earrings, Kolhapuri bangles and bridal maang tikkas.",
    keywords: "Maharashtra jewellery, imitation jewellery, Paithani, temple jewellery, jhumka, bangles, maang tikka, Jayshree Collections",
    openGraph: {
        title: "Jayshree Collections",
        description: "Modern Maharashtra Jewellery",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${montserrat.variable}`}>
            <head />
            <body className="bg-brand antialiased overflow-x-hidden">
                <div className="bg-noise" />
                <CartProvider>
                    <LenisProvider>
                        {children}
                    </LenisProvider>
                </CartProvider>
            </body>
        </html>
    );
}
