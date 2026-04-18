import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Jayashri Collections',
  description: 'The terms and conditions that govern your use of Jayashri Collections.',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#F0E6C2]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-10 pt-32 pb-24">
        <header className="mb-12 border-b border-[#BFA06A]/20 pb-8">
          <p className="font-montserrat text-[#BFA06A] text-xs tracking-[0.3em] uppercase mb-3">Legal</p>
          <h1 className="font-cormorant text-4xl md:text-5xl text-[#F0E6C2] font-medium">
            Terms of Service
          </h1>
          <p className="font-montserrat text-[#F0E6C2]/60 text-sm mt-4">
            Last updated: April 2026
          </p>
        </header>

        <div className="space-y-10 font-montserrat text-[#F0E6C2]/80 text-sm md:text-base leading-relaxed">
          <section>
            <p>
              Welcome to Jayashri Collections. These Terms of Service (&quot;Terms&quot;) govern your access to and use of
              our website, products and services. Jayashri Collections is a brand operated by{' '}
              <strong className="text-[#F0E6C2]">Mansi Pravin Ramane</strong>, a sole proprietorship based in Thane,
              Maharashtra, India. Throughout these Terms, &quot;we&quot;, &quot;us&quot; and &quot;our&quot; refer
              to this legal entity. By visiting our site or placing an order with us, you agree to be bound by these
              Terms. If you do not agree, please do not use our Service.
            </p>
            <p className="mt-4">
              We reserve the right to update or modify these Terms at any time. Continued use of the site after any
              change constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">1. Eligibility & Use of the Store</h2>
            <p>
              By agreeing to these Terms, you confirm that you are at least the age of majority in your state of
              residence, or that you have given us your consent to allow any minor dependants to use this site.
              You may not use our products for any illegal or unauthorised purpose, nor may you, in the use of the
              Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">2. General Conditions</h2>
            <p>
              We reserve the right to refuse service to anyone, for any reason, at any time. You understand that your
              content (not including payment information) may be transferred unencrypted and involve transmissions over
              various networks. Payment details are always encrypted during transfer over networks.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">3. Product Information & Accuracy</h2>
            <p>
              Every piece at Jayashri Collections is hand-crafted or hand-finished. Weights, stone placements, and
              finishes may vary slightly from one piece to the next — this is a mark of authenticity, not a defect.
              Colours shown on your screen may differ from the actual product depending on your display. We make
              every effort to represent our collections accurately but do not warrant that product descriptions or
              any other content on this site is always current, complete or error-free.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">4. Pricing & Availability</h2>
            <p>
              All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.
              Prices and product availability are subject to change without notice. We reserve the right to discontinue
              any collection at any time. In case of an obvious pricing or listing error, we reserve the right to
              cancel the affected order and issue a full refund.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">5. Orders & Payment</h2>
            <p>
              When you place an order, you are making an offer to purchase. We reserve the right to accept, refuse,
              or limit any order at our discretion. Orders are confirmed only once payment is successfully captured
              through our payment processor. We currently accept payments via Cashfree, including UPI, cards,
              net-banking and wallets. You agree to provide current, complete and accurate billing and shipping
              information for all purchases.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">6. Shipping & Delivery</h2>
            <p>
              We ship across India through our logistics partners. Delivery timelines shown at checkout are estimates
              and may vary due to courier delays, remote locations, weather, public holidays or other events outside
              our control. Risk of loss passes to you once the order has been handed over to the courier. Please
              refer to our Shipping Information page for more details.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">7. Returns & Exchanges</h2>
            <p>
              Since each piece of imitation jewellery is delicate and hand-finished, returns are accepted only in
              case of a manufacturing defect or a verified damaged-in-transit claim raised within 48 hours of delivery,
              supported by an unboxing video. Customised, altered or personalised pieces are not eligible for return.
              Please refer to our Return Policy page for the complete process.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">8. Intellectual Property</h2>
            <p>
              All content on this site — including product photographs, videos, designs, text, logos, the Jayashri
              Collections name and the overall look and feel — is the property of Jayashri Collections or its licensors
              and is protected by Indian and international intellectual property laws. You may not copy, reproduce,
              distribute or create derivative works from any of our content without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">9. User Submissions</h2>
            <p>
              If you send us comments, suggestions, reviews or any other submissions, you grant us an irrevocable,
              royalty-free right to use, reproduce and publish that content in any medium. You agree that your
              submissions will not contain anything unlawful, defamatory, obscene or that infringes the rights of
              any third party. We are under no obligation to publish or retain any user submission.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">10. Third-Party Services & Links</h2>
            <p>
              Our site may contain links to or integrate with third-party services (such as Cashfree for payments
              and Shiprocket for logistics). We are not responsible for examining or evaluating the content or
              accuracy of these third parties, and we do not warrant or assume liability for any third-party
              materials, websites or services.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">11. Prohibited Uses</h2>
            <p>
              You are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit
              others to perform unlawful acts; (c) to infringe on any intellectual property rights; (d) to harass,
              abuse or discriminate; (e) to submit false or misleading information; (f) to upload or transmit viruses
              or any malicious code; (g) to collect or track the personal information of others; (h) to spam, phish
              or scrape; or (i) to interfere with or circumvent the security features of the Service.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">12. Disclaimer of Warranties & Limitation of Liability</h2>
            <p>
              We do not guarantee that your use of our service will be uninterrupted, timely, secure or error-free.
              The service and all products and services delivered to you through the service are (except as expressly
              stated by us) provided &apos;as is&apos; and &apos;as available&apos; for your use, without any representation,
              warranties or conditions of any kind. In no case shall Jayashri Collections, our directors, officers,
              employees, affiliates, agents or suppliers be liable for any injury, loss, claim, or any direct,
              indirect, incidental, punitive, special or consequential damages of any kind arising out of your use
              of the service or any products procured using the service.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">13. Indemnification</h2>
            <p>
              You agree to indemnify, defend and hold harmless Jayashri Collections and its affiliates from any claim
              or demand, including reasonable legal fees, made by any third party due to or arising out of your
              breach of these Terms or your violation of any law or the rights of a third party.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unlawful, void or unenforceable, such provision shall
              nonetheless be enforced to the fullest extent permitted by law, and the remaining provisions will
              continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">15. Termination</h2>
            <p>
              These Terms are effective unless and until terminated by either you or us. You may terminate these
              Terms at any time by discontinuing use of our site. We may terminate this agreement at any time without
              notice if, in our sole judgement, you fail to comply with any term or provision of these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">16. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of India. Any
              dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction
              of the courts of Maharashtra, India.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">17. Contact Us</h2>
            <p>
              Questions about these Terms of Service should be sent to us at{' '}
              <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>.
            </p>
            <p className="mt-4">
              You can also reach us through our{' '}
              <Link href="/" className="text-[#BFA06A] hover:underline">homepage</Link> or via our social channels listed in the footer.
            </p>
            <div className="mt-8 p-6 border border-[#BFA06A]/20 bg-[#BFA06A]/5 rounded">
              <p className="font-montserrat text-[#BFA06A] text-xs tracking-[0.3em] uppercase mb-3">Operator / Legal Entity</p>
              <p className="text-[#F0E6C2] font-medium">Mansi Pravin Ramane (Sole Proprietor)</p>
              <p className="text-[#F0E6C2]/70 text-sm mt-2">
                Registered Address: Jayashri Collection, Shop No. 4 &amp; 5, Indraratna Palace,<br />
                Near Ganpati Mandir, Jambhali Naka, Thane West,<br />
                Thane, Maharashtra 400602, India
              </p>
              <p className="text-[#F0E6C2]/70 text-sm mt-2">
                Phone: +91 95189 00906 · Email: order@jc-admin.services
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
