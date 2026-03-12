import { assetUrl } from '@/lib/assets';

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    formattedPrice: string;
    image: string;
    material: string;
    description: string;
}

export const catalog: Product[] = [
    {
        id: 'royal-kundan-haram',
        name: 'The Royal Kundan Haram',
        category: 'Harams & Sets',
        price: 245000,
        formattedPrice: '₹2,45,000',
        image: assetUrl('/images/necklace.png'),
        material: '22k Gold • Uncut Diamonds',
        description: 'A masterpiece of traditional craftsmanship, this uncut diamond haram features intricate kundan setting passed down through generations of artisans. Designed to be the centerpiece of a majestic bridal trousseau.',
    },
    {
        id: 'majestic-jhumkas',
        name: 'Majestic Jhumkas',
        category: 'Jhumkas',
        price: 85000,
        formattedPrice: '₹85,000',
        image: assetUrl('/images/earrings.png'),
        material: '22k Gold • Antique Finish',
        description: 'Statement jhumkas featuring a delicate peacock motif and finished with an antique gold oxidization. They perfectly balance grandeur with wearability for festive occasions.',
    },
    {
        id: 'bridal-kadas',
        name: 'Bridal Kadas',
        category: 'Kadas & Bangles',
        price: 120000,
        formattedPrice: '₹1,20,000',
        image: assetUrl('/images/bangles.png'),
        material: '24k Gold Polish • Rubies',
        description: 'Bold and unapologetically luxurious, these bridal kadas are encrusted with hand-picked Burmese rubies, set against a rich 24k gold polished base.',
    },
    {
        id: 'imperial-maang-tikka',
        name: 'Imperial Maang Tikka',
        category: 'Maang Tikkas',
        price: 45000,
        formattedPrice: '₹45,000',
        image: assetUrl('/images/maangtikka.png'),
        material: '22k Gold • Pearls',
        description: 'A delicate yet striking maang tikka, adorned with lustrous basra pearls. It brings a regal finish to any traditional ensemble without overwhelming the wearer.',
    },
    {
        id: 'diamond-choker-set',
        name: 'Diamond Choker Set',
        category: 'Harams & Sets',
        price: 350000,
        formattedPrice: '₹3,50,000',
        image: assetUrl('/images/necklace.png'),
        material: '18k White Gold • VVS Diamonds',
        description: 'For the modern bride. A breathtaking choker set crafted in 18k white gold, featuring a continuous cascade of VVS clarity diamonds that catch light from every angle.',
    },
    {
        id: 'temple-finish-bangles',
        name: 'Temple Finish Bangles',
        category: 'Kadas & Bangles',
        price: 95000,
        formattedPrice: '₹95,000',
        image: assetUrl('/images/bangles.png'),
        material: '22k Gold • Antique Finish',
        description: 'Inspired by the grand temple architecture of South India, these bangles are meticulously carved with divine motifs, offering a timeless addition to your heritage collection.',
    },
    {
        id: 'lakshmi-temple-choker',
        name: 'Lakshmi Temple Choker',
        category: 'Harams & Sets',
        price: 129900,
        formattedPrice: '₹1,29,900',
        image: assetUrl('/images/necklace.png'),
        material: '22k Gold • Temple Work',
        description: 'Traditional lakshmi motif choker crafted with intricate temple jewelry techniques.',
    },
    {
        id: 'pearl-jhumka-set',
        name: 'Pearl Jhumka Set',
        category: 'Jhumkas',
        price: 64900,
        formattedPrice: '₹64,900',
        image: assetUrl('/images/earrings.png'),
        material: '22k Gold • South Sea Pearls',
        description: 'Elegant jhumkas featuring authentic south sea pearls and delicate gold filigree.',
    },
    {
        id: 'enamel-bangle-stack',
        name: 'Enamel Bangle Stack',
        category: 'Kadas & Bangles',
        price: 89900,
        formattedPrice: '₹89,900',
        image: assetUrl('/images/bangles.png'),
        material: '22k Gold • Meenakari Enamel',
        description: 'A vibrant stack of bangles showcasing traditional Rajasthani Meenakari enamel work.',
    },
    {
        id: 'kundan-maang-tikka',
        name: 'Kundan Maang Tikka',
        category: 'Maang Tikkas',
        price: 159900,
        formattedPrice: '₹1,59,900',
        image: assetUrl('/images/maangtikka.png'),
        material: '24k Gold Polish • Glass Kundan',
        description: 'An oversized statement maang tikka perfect for bridal ceremonies and grand events.',
    },
    {
        id: 'paithani-haaram',
        name: 'Paithani Haaram',
        category: 'Harams & Sets',
        price: 219900,
        formattedPrice: '₹2,19,900',
        image: assetUrl('/images/necklace.png'),
        material: '22k Gold • Ruby & Emerald Stones',
        description: 'Inspired by the weave of traditional Paithani sarees, this long necklace is a true heirloom.',
    },
    {
        id: 'gold-jhumki-earrings',
        name: 'Gold Jhumki Earrings',
        category: 'Jhumkas',
        price: 44900,
        formattedPrice: '₹44,900',
        image: assetUrl('/images/earrings.png'),
        material: '22k Gold • Antique Finish',
        description: 'Versatile daily-wear jhumkis with a subtle antique finish for an understated classic look.',
    },
];

export function getProductById(id: string): Product | undefined {
    return catalog.find(p => p.id === id);
}

export function getRelatedProducts(category: string, currentId: string): Product[] {
    return catalog.filter(p => p.category === category && p.id !== currentId).slice(0, 3);
}
