import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import ProductShowcase from '@/components/sections/ProductShowcase';
import BrandStory from '@/components/sections/BrandStory';
import ProcessSection from '@/components/sections/ProcessSection';
import Testimonials from '@/components/sections/Testimonials';
import Footer from '@/components/ui/Footer';
import { getProducts } from '@/lib/products';

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
    const featuredProducts = await getProducts({ featured: true, limit: 4 });

    return (
        <main>
            <Navbar />
            <Hero />
            <FeaturedCollections featuredProducts={featuredProducts} />
            <ProductShowcase />
            <BrandStory />
            <ProcessSection />
            <Testimonials />
            <Footer />
        </main>
    );
}
