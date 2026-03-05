import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import BrandStory from '@/components/sections/BrandStory';
import ProcessSection from '@/components/sections/ProcessSection';
import Testimonials from '@/components/sections/Testimonials';
import Footer from '@/components/ui/Footer';

export default function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <FeaturedCollections />
            <BrandStory />
            <ProcessSection />
            <Testimonials />
            <Footer />
        </main>
    );
}
