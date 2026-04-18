'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

interface FAQ { q: string; a: React.ReactNode; }

interface FAQSection { title: string; items: FAQ[]; }

const sections: FAQSection[] = [
  {
    title: 'Orders & Payments',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major Indian payment methods through Cashfree: UPI (Google Pay, PhonePe, Paytm), credit and debit cards (Visa, Mastercard, Rupay, AmEx), net banking, and wallets. All payments are processed securely — we never store your card details.',
      },
      {
        q: 'Is my payment secure?',
        a: 'Yes. Every transaction is encrypted end-to-end via Cashfree, a PCI-DSS compliant payment gateway. Your card and UPI details never touch our servers.',
      },
      {
        q: 'Do you offer Cash on Delivery (COD)?',
        a: 'Not currently. We accept prepaid orders only through Cashfree. This keeps our prices competitive and ensures orders ship the same day.',
      },
      {
        q: 'I was charged but didn\'t receive an order confirmation.',
        a: (
          <>
            If Cashfree captured your payment but you didn&apos;t receive a confirmation email within 15 minutes,
            email us at <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>{' '}
            with the payment ID. We&apos;ll verify and either complete your order or refund within 5–7 business days.
          </>
        ),
      },
      {
        q: 'Can I change or cancel my order after placing it?',
        a: 'Yes, if the order hasn\'t shipped yet. Email us immediately at order@jc-admin.services with your order number. Once shipped (you\'ll get a shipment email), the order cannot be cancelled — but you can still return it within 48 hours of delivery if eligible.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    items: [
      {
        q: 'Where do you ship?',
        a: 'Pan-India to all serviceable pincodes. International shipping is coming soon — contact us for a custom quote.',
      },
      {
        q: 'How long does delivery take?',
        a: (
          <>
            <strong className="text-[#F0E6C2]">Standard</strong> (free): 5–7 business days.{' '}
            <strong className="text-[#F0E6C2]">Express</strong> (₹499 flat): 1–2 business days.{' '}
            Remote pincodes may take 2–4 additional days. See our{' '}
            <Link href="/policies/shipping" className="text-[#BFA06A] hover:underline">Shipping Information</Link> for full details.
          </>
        ),
      },
      {
        q: 'Which courier will deliver my order?',
        a: 'We partner with Delhivery, Xpressbees, DTDC, and BlueDart. The courier assigned depends on your pincode. You\'ll receive the courier name and AWB tracking number in your shipment email.',
      },
      {
        q: 'How do I track my order?',
        a: (
          <>
            Click the tracking link in your shipment email, OR visit our{' '}
            <Link href="/track" className="text-[#BFA06A] hover:underline">Track Order</Link> page and enter your order number + email.
          </>
        ),
      },
      {
        q: 'My package hasn\'t moved for several days. What do I do?',
        a: 'If your tracking shows no update for 4+ business days, email us with your order number. We\'ll check with the courier and resolve it — either get it moving, re-ship if lost, or refund.',
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    items: [
      {
        q: 'Can I return a product?',
        a: (
          <>
            Yes, for manufacturing defects, damage in transit, or wrong item received. Requests must be raised within{' '}
            <strong className="text-[#F0E6C2]">48 hours of delivery</strong> with an unboxing video. See our{' '}
            <Link href="/policies/refund" className="text-[#BFA06A] hover:underline">Refund Policy</Link> for the full process.
          </>
        ),
      },
      {
        q: 'What can\'t be returned?',
        a: 'Customised or personalised pieces, items worn/altered after delivery, items without original packaging, final-sale items, and change-of-mind returns on non-defective products.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Once we receive the return and approve it, refunds are processed within 3–5 business days. The amount lands in your original payment method within another 5–7 business days (UPI is fastest, cards take longest).',
      },
      {
        q: 'Can I exchange for a different item instead of getting a refund?',
        a: 'Yes. Email us with your order number and the piece you\'d like instead. If the new piece is more expensive, we\'ll send a Cashfree payment link for the difference. If it\'s cheaper, we\'ll refund the balance.',
      },
    ],
  },
  {
    title: 'Products & Care',
    items: [
      {
        q: 'Is your jewellery real gold?',
        a: 'Our pieces are imitation jewellery — handcrafted in brass, copper, or alloy with high-quality gold-tone plating, matte finishes, or antique oxidisation. They\'re designed to look and feel premium while remaining accessible. We do not claim any hallmark or real gold/silver content.',
      },
      {
        q: 'How should I care for my jewellery?',
        a: 'Keep it dry: no water, sweat, perfume, or deodorant directly on the piece. Store in the pouch we provide, away from humidity. Wipe gently with a soft dry cloth after use. Avoid storing multiple pieces together to prevent scratches.',
      },
      {
        q: 'Are the stones real?',
        a: 'Most pieces feature AD (American Diamond), CZ (cubic zirconia), kundan glass, or kemp stones — all synthetic / lab-made. These are specifically chosen for their brilliance, durability, and affordability.',
      },
      {
        q: 'Will the colour fade over time?',
        a: 'With proper care, plating lasts 12–24 months of regular wear. Factors that speed up fading: exposure to water, perfume, sweat, harsh chemicals, and improper storage. Handling with dry hands and storing in our provided pouch dramatically extends the life.',
      },
      {
        q: 'Do you offer bridal / bulk orders?',
        a: (
          <>
            Yes! For bridal trousseau or bulk orders, email{' '}
            <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>{' '}
            with your requirements and we&apos;ll share a custom quote with special pricing.
          </>
        ),
      },
    ],
  },
  {
    title: 'Account & Support',
    items: [
      {
        q: 'Do I need to create an account to order?',
        a: 'No account needed — checkout as a guest. Your order details and tracking are linked to your email address. You\'ll get all updates via email.',
      },
      {
        q: 'How do I contact customer support?',
        a: (
          <>
            Email <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>{' '}
            or call <a href="tel:+919518900906" className="text-[#BFA06A] hover:underline">+91 95189 00906</a>. Business hours
            are Mon–Sat, 10 AM – 7 PM IST. We typically reply to emails within 24 hours.
          </>
        ),
      },
      {
        q: 'Do you have a physical store?',
        a: 'Yes — visit us at Shop No. 4 & 5, Indraratna Palace, near Ganpati Mandir, Jambhali Naka, Thane West, Thane, Maharashtra 400602. Try pieces in person and get personalised recommendations.',
      },
    ],
  },
];

function FAQItem({ q, a }: FAQ) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#BFA06A]/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left hover:text-[#BFA06A] transition-colors cursor-pointer group"
      >
        <span className="font-cormorant text-white text-lg md:text-xl pr-4 group-hover:text-[#BFA06A] transition-colors">{q}</span>
        {open ? <Minus className="w-5 h-5 text-[#BFA06A] shrink-0" /> : <Plus className="w-5 h-5 text-[#BFA06A]/60 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-8 font-montserrat text-[#F0E6C2]/70 text-sm md:text-base leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQsPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#F0E6C2]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-10 pt-32 pb-24">
        <header className="text-center mb-16">
          <p className="font-montserrat text-[#BFA06A] text-[0.65rem] tracking-[0.5em] uppercase mb-4">Help Centre</p>
          <h1 className="font-cormorant text-white font-medium leading-none drop-shadow-lg" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
            Frequently <em className="text-[#BFA06A]">Asked Questions</em>
          </h1>
        </header>

        <div className="space-y-14">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4 border-b border-[#BFA06A]/20 pb-3">
                {section.title}
              </h2>
              <div>
                {section.items.map((item, i) => (
                  <FAQItem key={i} {...item} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-20 text-center border border-[#BFA06A]/15 p-10 rounded">
          <p className="font-cormorant text-white text-2xl md:text-3xl mb-4">Still have questions?</p>
          <p className="font-montserrat text-[#F0E6C2]/60 text-sm mb-6">
            Our team is here to help — usually replies within 24 hours on business days.
          </p>
          <a
            href="mailto:order@jc-admin.services"
            className="inline-block bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.3em] uppercase px-10 py-4 font-bold hover:bg-[#D4B580] transition-colors"
          >
            Email Us
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
