'use client';

const items = [
    'नथ', 'कानातले', 'गळ्यातले', 'बांगडी', 'मांग टिका',
    'नथ', 'कानातले', 'गळ्यातले', 'बांगडी', 'मांग टिका',
];

const MarqueeBar = () => (
    <div className="relative overflow-hidden bg-gradient-to-r from-gold-dark via-gold to-gold-dark py-4 border-y border-yellow-600/30">
        <div className="flex">
            <div className="marquee-track">
                {[...items, ...items].map((item, i) => (
                    <span key={i} className="flex items-center gap-4 px-6">
                        <span className="font-playfair text-maroon-dark font-semibold text-sm tracking-widest uppercase">
                            {item}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-maroon-dark/50 inline-block" />
                    </span>
                ))}
            </div>
        </div>
        {/* Gradient edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gold-dark to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gold-dark to-transparent pointer-events-none" />
    </div>
);

export default MarqueeBar;
