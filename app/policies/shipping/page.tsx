import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Shipping Information | Jayashri Collections',
  description: 'Delivery timelines, charges and shipping partner information for Jayashri Collections orders.',
};

export default function ShippingPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#F0E6C2]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-10 pt-32 pb-24">
        <header className="mb-12 border-b border-[#BFA06A]/20 pb-8">
          <p className="font-montserrat text-[#BFA06A] text-xs tracking-[0.3em] uppercase mb-3">Shipping</p>
          <h1 className="font-cormorant text-4xl md:text-5xl text-[#F0E6C2] font-medium">
            Shipping Information
          </h1>
          <p className="font-montserrat text-[#F0E6C2]/60 text-sm mt-4">Last updated: April 2026</p>
        </header>

        <div className="space-y-10 font-montserrat text-[#F0E6C2]/80 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Where We Ship</h2>
            <p>
              We currently ship <strong className="text-[#F0E6C2]">pan-India</strong> to all serviceable pincodes.
              International shipping is coming soon — if you&apos;d like to place an international order, email us
              at <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>{' '}
              and we&apos;ll arrange a custom quote.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Delivery Timelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-5 border border-[#BFA06A]/20 bg-[#BFA06A]/5 rounded">
                <p className="font-montserrat text-[#BFA06A] text-xs tracking-[0.25em] uppercase mb-2">Standard</p>
                <p className="text-[#F0E6C2] text-base">5 – 7 business days</p>
                <p className="text-[#F0E6C2]/50 text-xs mt-1">Free shipping on all orders</p>
              </div>
              <div className="p-5 border border-[#BFA06A]/20 bg-[#BFA06A]/5 rounded">
                <p className="font-montserrat text-[#BFA06A] text-xs tracking-[0.25em] uppercase mb-2">Express</p>
                <p className="text-[#F0E6C2] text-base">1 – 2 business days</p>
                <p className="text-[#F0E6C2]/50 text-xs mt-1">Flat ₹499 across India</p>
              </div>
            </div>
            <p className="mt-4 text-[#F0E6C2]/70 text-sm">
              Orders are dispatched within 24–48 hours of confirmation. Delivery timelines begin from the day of
              dispatch, not the day of order placement. Remote pincodes (North-East, J&amp;K, Andaman, some parts
              of Leh-Ladakh and Kerala interiors) may take 2–4 additional business days.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Our Courier Partners</h2>
            <p>
              We ship through trusted logistics partners including <strong className="text-[#F0E6C2]">Delhivery</strong>,{' '}
              <strong className="text-[#F0E6C2]">Xpressbees</strong>, <strong className="text-[#F0E6C2]">DTDC</strong>,
              and <strong className="text-[#F0E6C2]">BlueDart</strong>. The specific courier assigned to your order
              depends on your delivery pincode and the selected shipping speed. You&apos;ll receive the courier name
              and AWB tracking number by email as soon as your package is dispatched.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Tracking Your Order</h2>
            <p>
              Once dispatched, you can track your shipment at any time:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Click the tracking link in the shipment email we send you</li>
              <li>Visit our <Link href="/track" className="text-[#BFA06A] hover:underline">Track Order</Link> page and enter your order number + email</li>
              <li>Use the AWB tracking number directly on the courier&apos;s website</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Packaging</h2>
            <p>
              Every order is individually inspected and packed in our signature gift-ready box with a care card and
              soft pouch. Fragile pieces are wrapped in tissue and bubble wrap for protection during transit. If
              you&apos;d like gift packaging or a hand-written note, just mention it in the order notes or email us.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Delivery Failures &amp; Re-attempts</h2>
            <p>
              Our courier partners typically make 3 delivery attempts before returning a shipment to us. If the
              package is returned due to incorrect address, customer unavailable, or refusal:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>We&apos;ll contact you to arrange re-shipment</li>
              <li>Re-shipment is free if the address was incorrect due to our error</li>
              <li>Re-shipment will incur standard shipping charges (₹99–₹199) if the address was provided incorrectly by the customer</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Damaged or Lost in Transit</h2>
            <p>
              If your package arrives damaged or never arrives:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-[#F0E6C2]">Damaged in transit</strong>: Please record an unboxing video and
                email it to us within <strong className="text-[#F0E6C2]">48 hours of delivery</strong>. We&apos;ll
                arrange a replacement or refund per our <Link href="/policies/refund" className="text-[#BFA06A] hover:underline">Refund Policy</Link>.
              </li>
              <li>
                <strong className="text-[#F0E6C2]">Lost in transit</strong>: If tracking hasn&apos;t moved for 7+ days,
                reach out and we&apos;ll file a claim with the courier and either re-ship or refund.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Questions?</h2>
            <p>
              For anything related to your shipment, email{' '}
              <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>{' '}
              with your order number. We typically reply within 24 hours on business days.
            </p>
            <p className="mt-6 text-[#F0E6C2]/50 text-xs">
              Jayashri Collections is a brand operated by <strong className="text-[#F0E6C2]/80">Mansi Pravin Ramane</strong>, a sole proprietorship based in Thane, Maharashtra, India.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
