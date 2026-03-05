import { Suspense } from 'react';
import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import MarqueeBar from '@/components/sections/MarqueeBar';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import BrandStory from '@/components/sections/BrandStory';
import Bestsellers from '@/components/sections/Bestsellers';
import Testimonials from '@/components/sections/Testimonials';
import Footer from '@/components/ui/Footer';

export default function Home() {
    // Using image fallback; video is progressive enhancement
    const heroVideoSrc = '/images/hero-video.mp4';

    return (
        <main>
            <Navbar />
            <Suspense fallback={null}>
                <Hero videoSrc={heroVideoSrc} />
            </Suspense>
            <MarqueeBar />
            <FeaturedCollections />
            <BrandStory />
            <Bestsellers />
            <Testimonials />
            <Footer />
        </main>
    );
}
