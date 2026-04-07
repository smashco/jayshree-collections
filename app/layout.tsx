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
    icons: {
        icon: '/favicon.png',
        apple: '/apple-touch-icon.png',
    },
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
            <head>
                <script dangerouslySetInnerHTML={{ __html: `
                    (function(){
                        var CART_VER = 3;
                        var key = 'jayshree_cart_v2';
                        var verKey = 'jayshree_cart_ver';
                        try {
                            var ver = parseInt(localStorage.getItem(verKey) || '0');
                            if (ver < CART_VER) {
                                var raw = localStorage.getItem(key);
                                if (raw) {
                                    var items = JSON.parse(raw);
                                    var clean = items.filter(function(i){ return i.variantId && i.variantId.length > 5; });
                                    localStorage.setItem(key, JSON.stringify(clean));
                                }
                                localStorage.removeItem('jayshree_cart');
                                localStorage.setItem(verKey, String(CART_VER));
                            }
                        } catch(e){}
                    })();
                `}} />
            </head>
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
