import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Jayashri Collections',
  description: 'How Jayashri Collections collects, uses and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#F0E6C2]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-10 pt-32 pb-24">
        <header className="mb-12 border-b border-[#BFA06A]/20 pb-8">
          <p className="font-montserrat text-[#BFA06A] text-xs tracking-[0.3em] uppercase mb-3">Legal</p>
          <h1 className="font-cormorant text-4xl md:text-5xl text-[#F0E6C2] font-medium">
            Privacy Policy
          </h1>
          <p className="font-montserrat text-[#F0E6C2]/60 text-sm mt-4">
            Last updated: April 2026
          </p>
        </header>

        <div className="space-y-10 font-montserrat text-[#F0E6C2]/80 text-sm md:text-base leading-relaxed">
          <section>
            <p>
              At Jayashri Collections, your trust means everything to us. This Privacy Policy explains what information
              we collect when you visit jc-admin.services and related sites, how we use it, and the choices you have.
              By using our site and placing an order, you agree to the practices described below.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">1. What We Collect</h2>
            <p className="mb-4">We collect information in two ways:</p>
            <p className="mb-3">
              <strong className="text-[#F0E6C2]">Information you give us:</strong> When you place an order, create an
              account or contact us, we collect personal details such as your name, email address, phone number,
              billing and shipping addresses, and order history. When you make a purchase, our payment processor
              (Razorpay) collects the payment details needed to complete the transaction.
            </p>
            <p>
              <strong className="text-[#F0E6C2]">Information collected automatically:</strong> When you browse our
              site, we automatically receive your IP address, browser type, device information, referring pages,
              and pages visited. This helps us understand how our site is used and improve your experience.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process, fulfil and deliver your orders</li>
              <li>Send order confirmations, shipment updates and delivery notifications</li>
              <li>Respond to customer service requests and inquiries</li>
              <li>Prevent fraud, abuse, and unauthorised transactions</li>
              <li>Improve our products, website and overall customer experience</li>
              <li>With your permission, send you occasional updates about new collections, festive drops and offers</li>
            </ul>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">3. Consent</h2>
            <p>
              When you provide personal information to complete a transaction, verify your card, place an order,
              arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using
              it for that specific reason only. If we ask for your personal information for a secondary reason,
              such as marketing, we will either ask you directly for your expressed consent, or provide you with
              an opportunity to say no. You may withdraw your consent at any time by contacting us at{' '}
              <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">4. Sharing With Third Parties</h2>
            <p className="mb-3">We do not sell your personal information. We share it only with trusted partners who help us operate our store:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-[#F0E6C2]">Razorpay</strong> — for securely processing payments. Razorpay is
                PCI-DSS compliant and handles all card, UPI and net-banking information directly.
              </li>
              <li>
                <strong className="text-[#F0E6C2]">Shiprocket and our courier partners</strong> — to pick up, ship,
                and deliver your order. They receive your name, phone number and shipping address.
              </li>
              <li>
                <strong className="text-[#F0E6C2]">Resend</strong> — to deliver transactional emails such as order
                confirmations and shipping notifications.
              </li>
              <li>
                <strong className="text-[#F0E6C2]">AWS (Amazon Web Services)</strong> — for secure hosting of media
                and site assets.
              </li>
              <li>
                <strong className="text-[#F0E6C2]">Railway</strong> — for hosting the application and database
                infrastructure.
              </li>
            </ul>
            <p className="mt-4">
              We may also disclose your information if we are required to do so by law or if you violate our Terms
              of Service.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">5. Data Security</h2>
            <p>
              We take reasonable precautions and follow industry best practices to ensure your personal information
              is not inappropriately lost, misused, accessed, disclosed, altered or destroyed. All data in transit
              is encrypted using SSL/TLS. Payment information is never stored on our servers — it is handled
              entirely by our PCI-DSS compliant payment processor.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">6. Cookies & Local Storage</h2>
            <p>
              We use cookies and browser local storage to remember your shopping cart, keep you signed in to the
              admin dashboard, and understand how visitors use our site. You can disable cookies in your browser
              settings, but please note that some parts of the site (such as the cart and checkout) may not work
              correctly without them.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">7. Data Retention</h2>
            <p>
              When you place an order through our site, we will maintain your order information in our records
              unless and until you ask us to erase it. We may retain certain information for as long as required
              for legal, tax and accounting obligations under Indian law.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">8. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of any inaccurate information</li>
              <li>Request deletion of your personal information (subject to legal obligations)</li>
              <li>Withdraw consent for marketing communications at any time</li>
              <li>Lodge a complaint with the relevant data protection authority</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">9. Age of Consent</h2>
            <p>
              By using this site, you represent that you are at least the age of majority in your state or province
              of residence, or that you are the age of majority and have given us your consent to allow any of your
              minor dependants to use this site.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">10. Changes to This Policy</h2>
            <p>
              We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes
              and clarifications will take effect immediately upon their posting on the website. If we make material
              changes, we will notify you here and update the &apos;Last updated&apos; date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="font-cormorant text-2xl md:text-3xl text-[#BFA06A] mb-4">11. Contact Us</h2>
            <p>
              If you would like to access, correct, amend or delete any personal information we have about you,
              or simply have a question about this policy, please write to us at{' '}
              <a href="mailto:order@jc-admin.services" className="text-[#BFA06A] hover:underline">order@jc-admin.services</a>.
            </p>
            <p className="mt-4">
              See our{' '}
              <Link href="/policies/terms-of-service" className="text-[#BFA06A] hover:underline">Terms of Service</Link> for the full terms that govern your use of this site.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
