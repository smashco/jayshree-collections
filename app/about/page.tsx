import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Jayashri Collections',
  description: 'The story behind Jayashri Collections — handcrafted imitation jewellery rooted in Maharashtrian heritage.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      <Navbar />

      <section className="flex-1 pt-32 pb-20 md:pt-48 md:pb-32 relative z-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="font-montserrat text-[#BFA06A] text-[0.65rem] tracking-[0.5em] uppercase font-medium mb-4">Our Story</p>
            <h1 className="font-cormorant text-white font-medium leading-none mb-6 drop-shadow-lg" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
              About <em className="text-[#BFA06A]">Jayashri Collections</em>
            </h1>
            <p className="font-playfair italic text-[#BFA06A] text-xl md:text-2xl mt-4">&ldquo;दागिना म्हणजे संस्कृती&rdquo;</p>
            <p className="font-montserrat text-[#F0E6C2]/50 text-sm mt-2">Jewellery is culture.</p>
          </div>

          <div className="space-y-10 font-montserrat text-[#F0E6C2]/80 text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Our Heritage</h2>
              <p>
                Jayashri Collections is rooted in the rich cultural landscape of Maharashtra — where every piece of
                jewellery is more than adornment. It is memory, lineage, and identity worn across generations.
                From the Peshwai courts of Pune to the temples of Nashik, the motifs, finishes and craftsmanship
                we draw from belong to a tradition that has been alive for centuries.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">What We Do</h2>
              <p>
                We curate and create imitation jewellery inspired by traditional Maharashtrian, South Indian,
                and Indo-Mughal design languages — kundan, temple, jadau, matte gold, meenakari and more.
                Every piece is built for real life: durable enough for festivals and daily wear, priced so
                heritage remains accessible, and designed so that each silhouette flatters without overwhelming.
              </p>
              <p className="mt-4">
                Our collections span <strong className="text-[#F0E6C2]">harams &amp; necklaces</strong>,{' '}
                <strong className="text-[#F0E6C2]">jhumkas &amp; studs</strong>,{' '}
                <strong className="text-[#F0E6C2]">kadas &amp; bangles</strong>, and{' '}
                <strong className="text-[#F0E6C2]">maang tikkas</strong> — from everyday essentials to bridal
                statement pieces.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Craft &amp; Care</h2>
              <p>
                Every piece is either hand-finished or hand-inspected before it reaches you. Small natural variations
                in stone placement, weight, or finish are signs of authentic craftsmanship — not defects. We pack each
                order individually in signature boxes with care cards that help you keep your jewellery looking new
                for years.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Visit Us</h2>
              <p>
                We&apos;re based in Thane West, Maharashtra — a stone&apos;s throw from the Jambhali Naka Ganpati
                Mandir. Whether you want to feel the weight of a choker in person, match a piece to your wedding
                lehenga, or simply share chai while we help you pick, our store is open and waiting.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Get in Touch</h2>
              <div className="p-6 border border-[#BFA06A]/20 bg-[#BFA06A]/5 rounded space-y-2">
                <p className="text-[#F0E6C2]"><strong>Jayashri Collection</strong></p>
                <p className="text-[#F0E6C2]/70">Shop No. 4 &amp; 5, Indraratna Palace,<br />Near Ganpati Mandir, Jambhali Naka,<br />Thane West, Thane, Maharashtra 400602, India</p>
                <p className="text-[#F0E6C2]/70">Phone: <a href="tel:+919518900906" className="text-[#BFA06A] hover:underline">+91 95189 00906</a></p>
                <p className="text-[#F0E6C2]/70">Email: <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a></p>
                <p className="text-[#F0E6C2]/70">Instagram: <a href="https://www.instagram.com/jayashricollection_official/" target="_blank" rel="noopener noreferrer" className="text-[#BFA06A] hover:underline">@jayashricollection_official</a></p>
              </div>
              <p className="text-[#F0E6C2]/50 text-xs mt-4">
                Jayashri Collections is a brand operated by <strong className="text-[#F0E6C2]/80">Mansi Pravin Ramane</strong>, a sole proprietorship based in Thane, Maharashtra, India.
              </p>
            </section>

            <section className="text-center pt-6">
              <Link href="/shop" className="inline-block border border-[#BFA06A]/30 text-[#BFA06A] font-montserrat text-xs tracking-[0.3em] uppercase px-10 py-4 hover:bg-[#BFA06A] hover:text-black transition-colors">
                Explore the Collection →
              </Link>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
