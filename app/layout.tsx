import type { Metadata } from "next";
import LenisProvider from "@/components/providers/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import "./globals.css";

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
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-brand antialiased overflow-x-hidden">
                <div className="bg-noise" />
                <LenisProvider>
                    <CustomCursor />
                    {children}
                </LenisProvider>
            </body>
        </html>
    );
}
