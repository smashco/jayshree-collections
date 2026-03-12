'use client';

import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, Heart } from 'lucide-react';

const Footer = () => (
    <footer id="contact" className="bg-maroon-dark text-yellow-100 relative overflow-hidden">
        {/* Decorative top border */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17Z' fill='%23D4AF37'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
        }} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Brand */}
                <div className="lg:col-span-1">
                    <h2 className="font-samarkan text-4xl shimmer-text mb-2">Jayshree</h2>
                    <p className="text-yellow-200/80 text-[11px] md:text-xs tracking-[0.4em] uppercase mb-4 font-medium">Collections</p>
                    <p className="font-inter text-yellow-100/90 text-sm md:text-base leading-relaxed mb-6 font-medium">
                        Imitation jewellery crafted with the spirit of Maharashtra.
                        Every piece tells the story of our heritage.
                    </p>
                    <p className="font-playfair italic text-gold text-xl drop-shadow-sm">
                        &quot;दागिना म्हणजे संस्कृती&quot;
                    </p>
                    <p className="text-yellow-200/60 text-sm font-inter mt-1 font-medium">Jewellery is culture.</p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-playfair text-lg font-bold text-yellow-50 mb-5">Quick Links</h3>
                    {['Collections', 'New Arrivals', 'Bestsellers', 'Bridal Sets', 'About Us'].map((link) => (
                        <a
                            key={link}
                            href="#"
                            className="block font-inter text-sm md:text-base text-yellow-100/80 hover:text-gold transition-all duration-200 mb-3 cursor-pointer hover:translate-x-1 font-medium"
                        >
                            {link}
                        </a>
                    ))}
                </div>

                {/* Customer Care */}
                <div>
                    <h3 className="font-playfair text-lg font-bold text-yellow-50 mb-5">Customer Care</h3>
                    {['My Orders', 'Return Policy', 'Shipping Info', 'Size Guide', 'FAQs'].map((link) => (
                        <a
                            key={link}
                            href="#"
                            className="block font-inter text-sm md:text-base text-yellow-100/80 hover:text-gold transition-colors duration-200 mb-3 cursor-pointer font-medium"
                        >
                            {link}
                        </a>
                    ))}
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-playfair text-lg font-bold text-yellow-50 mb-5">Get in Touch</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                            <p className="font-inter text-yellow-100/80 text-sm md:text-base font-medium">Nagpur, Maharashtra, India</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gold shrink-0" />
                            <a href="tel:+919876543210" className="font-inter text-yellow-100/80 text-sm md:text-base font-medium hover:text-gold transition-colors">+91 98765 43210</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gold shrink-0" />
                            <a href="mailto:hello@jayshreecollections.com" className="font-inter text-yellow-100/80 text-sm md:text-base font-medium hover:text-gold transition-colors break-all">hello@jayshreecollections.com</a>
                        </div>
                    </div>

                    {/* Social */}
                    <div className="flex gap-3 mt-6">
                        {[
                            { Icon: Instagram, label: 'Instagram' },
                            { Icon: Facebook, label: 'Facebook' },
                            { Icon: Youtube, label: 'YouTube' },
                        ].map(({ Icon, label }) => (
                            <a
                                key={label}
                                href="#"
                                aria-label={label}
                                className="w-9 h-9 glass-gold rounded-full flex items-center justify-center hover:bg-gold hover:text-maroon-dark transition-all duration-200 cursor-pointer"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="mt-12 pt-6 border-t border-yellow-100/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="font-inter text-yellow-100/60 text-xs md:text-sm font-medium">
                    © 2026 Jayshree Collections. All rights reserved.
                </p>
                <p className="font-inter text-yellow-100/60 text-xs md:text-sm font-medium flex items-center gap-1.5">
                    Made with <Heart className="w-4 h-4 text-primary fill-primary" /> in Maharashtra, India
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
