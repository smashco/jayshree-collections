import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Refund & Return Policy | Jayashri Collections',
  description: 'Returns, refunds and exchange policy for Jayashri Collections orders.',
};

export default function RefundPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#F0E6C2]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-10 pt-32 pb-24">
        <header className="mb-12 border-b border-[#BFA06A]/20 pb-8">
          <p className="font-montserrat text-[#BFA06A] text-xs tracking-[0.3em] uppercase mb-3">Returns</p>
          <h1 className="font-cormorant text-4xl md:text-5xl text-[#F0E6C2] font-medium">
            Refund &amp; Return Policy
          </h1>
          <p className="font-montserrat text-[#F0E6C2]/60 text-sm mt-4">Last updated: April 2026</p>
        </header>

        <div className="space-y-10 font-montserrat text-[#F0E6C2]/80 text-sm md:text-base leading-relaxed">
          <section>
            <p>
              At Jayashri Collections, we want you to love every piece you buy. This policy explains when and how
              you can return or exchange an order, and how we process refunds.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Eligibility for Return</h2>
            <p>We accept returns under the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-[#F0E6C2]">Manufacturing defect</strong>: loose stones, broken hooks, missing
                pearls, incorrect plating — visible issues that existed at the time of delivery.
              </li>
              <li>
                <strong className="text-[#F0E6C2]">Damaged in transit</strong>: the package or jewellery arrived visibly
                damaged. Supported by an unboxing video showing the sealed package.
              </li>
              <li>
                <strong className="text-[#F0E6C2]">Wrong item received</strong>: you received a different product than
                what you ordered.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Return Timeline</h2>
            <p>
              Raise a return request within <strong className="text-[#F0E6C2]">48 hours of delivery</strong> by
              emailing us at{' '}
              <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>{' '}
              with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your order number (e.g., <code className="text-[#BFA06A] bg-[#BFA06A]/10 px-2 py-0.5 rounded">JC-YYYYMMDD-XXXX</code>)</li>
              <li>A clear unboxing video (required for damage claims) showing the sealed parcel being opened</li>
              <li>Photos of the defect or wrong item</li>
              <li>Your reason for return</li>
            </ul>
            <p className="mt-4">
              Requests raised after 48 hours of delivery cannot be processed, as they fall outside our quality-control
              window.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Non-Returnable Items</h2>
            <p>The following are not eligible for return:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Customised, personalised or made-to-order pieces</li>
              <li>Items that have been worn, altered, or damaged after delivery</li>
              <li>Items returned without original packaging and care card</li>
              <li>Sale / clearance items (marked as &ldquo;Final Sale&rdquo; at checkout)</li>
              <li>Change of mind on non-defective products</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Return Process</h2>
            <ol className="list-decimal pl-6 space-y-2 mt-3">
              <li>Email us the details listed above within 48 hours of delivery.</li>
              <li>Our team reviews your request (usually within 24 hours) and confirms whether it qualifies for return.</li>
              <li>If approved, we&apos;ll arrange a reverse pickup through our logistics partner — usually within 2–3 business days.</li>
              <li>Keep the item in its original packaging until pickup.</li>
              <li>Once the returned item reaches us and passes QC inspection, we initiate your refund or replacement.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Refund Timelines</h2>
            <p>
              Once your return is received and approved, we process the refund within{' '}
              <strong className="text-[#F0E6C2]">3–5 business days</strong>. The refund lands in your original payment
              method within an additional 5–7 business days, depending on your bank:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-[#F0E6C2]">UPI</strong>: typically 1–3 business days after processing</li>
              <li><strong className="text-[#F0E6C2]">Credit / Debit cards</strong>: 5–7 business days</li>
              <li><strong className="text-[#F0E6C2]">Net Banking</strong>: 3–5 business days</li>
              <li><strong className="text-[#F0E6C2]">Wallets</strong>: typically same or next business day</li>
            </ul>
            <p className="mt-4">
              Refunds are processed through our payment gateway (Cashfree). You&apos;ll receive an email notification
              when the refund is initiated and a second one when it&apos;s credited.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Exchanges</h2>
            <p>
              Instead of a refund, you can request an exchange for a different size, colour, or another piece of equal
              or lesser value. If the exchanged item is of greater value, we&apos;ll email a payment link for the
              difference.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Order Cancellation</h2>
            <p>
              You may cancel an order free of charge before it is dispatched. Once the order is shipped (you&apos;ll
              receive a shipment email), cancellation is no longer possible — but you can still raise a return after
              delivery if the item qualifies under this policy.
            </p>
            <p className="mt-3">
              To cancel an unshipped order, email{' '}
              <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>{' '}
              as soon as possible with your order number.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Stock Oversell (Rare)</h2>
            <p>
              In very rare cases where an item sells out after you&apos;ve paid but before we can ship it, we&apos;ll
              issue a full refund within 5–7 business days and notify you immediately. No action is needed from your
              side.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">Need Help?</h2>
            <p>
              For any return or refund question, email{' '}
              <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>{' '}
              or call <a href="tel:+919518900906" className="text-[#BFA06A] hover:underline">+91 95189 00906</a>{' '}
              during business hours (Mon–Sat, 10 AM – 7 PM IST).
            </p>
            <p className="mt-6 text-[#F0E6C2]/50 text-xs">
              Jayashri Collections is a brand operated by <strong className="text-[#F0E6C2]/80">Mansi Pravin Ramane</strong>, a sole proprietorship based in Thane, Maharashtra, India.
            </p>
            <p className="mt-4">
              See also our <Link href="/policies/shipping" className="text-[#BFA06A] hover:underline">Shipping Information</Link>,{' '}
              <Link href="/policies/terms-of-service" className="text-[#BFA06A] hover:underline">Terms of Service</Link>{' '}
              and <Link href="/policies/privacy-policy" className="text-[#BFA06A] hover:underline">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
