import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ─── STAFF ACCOUNTS ─────────────────────────────────
  const passwordHash = await bcrypt.hash('jayshree2024', 10);

  await prisma.staff.upsert({
    where: { email: 'admin@jayshree.com' },
    update: {},
    create: {
      email: 'admin@jayshree.com',
      name: 'Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  await prisma.staff.upsert({
    where: { email: 'manager@jayshree.com' },
    update: {},
    create: {
      email: 'manager@jayshree.com',
      name: 'Manager',
      passwordHash,
      role: 'MANAGER',
    },
  });

  await prisma.staff.upsert({
    where: { email: 'staff@jayshree.com' },
    update: {},
    create: {
      email: 'staff@jayshree.com',
      name: 'Staff',
      passwordHash,
      role: 'STAFF',
    },
  });

  console.log('  ✓ Staff accounts created');

  // ─── CATEGORIES ─────────────────────────────────────
  const categories = [
    { name: 'Harams & Sets', slug: 'harams-sets', sortOrder: 1 },
    { name: 'Jhumkas', slug: 'jhumkas', sortOrder: 2 },
    { name: 'Kadas & Bangles', slug: 'kadas-bangles', sortOrder: 3 },
    { name: 'Maang Tikkas', slug: 'maang-tikkas', sortOrder: 4 },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryMap[cat.name] = created.id;
  }

  console.log('  ✓ Categories created');

  // ─── PRODUCTS ───────────────────────────────────────
  const products = [
    {
      slug: 'royal-kundan-haram',
      name: 'The Royal Kundan Haram',
      category: 'Harams & Sets',
      price: 24500000,
      image: '/images/necklace.png',
      material: '22k Gold • Uncut Diamonds',
      description: 'A masterpiece of traditional craftsmanship, this uncut diamond haram features intricate kundan setting passed down through generations of artisans. Designed to be the centerpiece of a majestic bridal trousseau.',
      featured: true,
    },
    {
      slug: 'majestic-jhumkas',
      name: 'Majestic Jhumkas',
      category: 'Jhumkas',
      price: 8500000,
      image: '/images/earrings.png',
      material: '22k Gold • Antique Finish',
      description: 'Statement jhumkas featuring a delicate peacock motif and finished with an antique gold oxidization. They perfectly balance grandeur with wearability for festive occasions.',
      featured: true,
    },
    {
      slug: 'bridal-kadas',
      name: 'Bridal Kadas',
      category: 'Kadas & Bangles',
      price: 12000000,
      image: '/images/bangles.png',
      material: '24k Gold Polish • Rubies',
      description: 'Bold and unapologetically luxurious, these bridal kadas are encrusted with hand-picked Burmese rubies, set against a rich 24k gold polished base.',
      featured: true,
    },
    {
      slug: 'imperial-maang-tikka',
      name: 'Imperial Maang Tikka',
      category: 'Maang Tikkas',
      price: 4500000,
      image: '/images/maangtikka.png',
      material: '22k Gold • Pearls',
      description: 'A delicate yet striking maang tikka, adorned with lustrous basra pearls. It brings a regal finish to any traditional ensemble without overwhelming the wearer.',
      featured: true,
    },
    {
      slug: 'diamond-choker-set',
      name: 'Diamond Choker Set',
      category: 'Harams & Sets',
      price: 35000000,
      image: '/images/necklace.png',
      material: '18k White Gold • VVS Diamonds',
      description: 'For the modern bride. A breathtaking choker set crafted in 18k white gold, featuring a continuous cascade of VVS clarity diamonds that catch light from every angle.',
      featured: false,
    },
    {
      slug: 'temple-finish-bangles',
      name: 'Temple Finish Bangles',
      category: 'Kadas & Bangles',
      price: 9500000,
      image: '/images/bangles.png',
      material: '22k Gold • Antique Finish',
      description: 'Inspired by the grand temple architecture of South India, these bangles are meticulously carved with divine motifs, offering a timeless addition to your heritage collection.',
      featured: false,
    },
    {
      slug: 'lakshmi-temple-choker',
      name: 'Lakshmi Temple Choker',
      category: 'Harams & Sets',
      price: 12990000,
      image: '/images/necklace.png',
      material: '22k Gold • Temple Work',
      description: 'Traditional lakshmi motif choker crafted with intricate temple jewelry techniques.',
      featured: false,
    },
    {
      slug: 'pearl-jhumka-set',
      name: 'Pearl Jhumka Set',
      category: 'Jhumkas',
      price: 6490000,
      image: '/images/earrings.png',
      material: '22k Gold • South Sea Pearls',
      description: 'Elegant jhumkas featuring authentic south sea pearls and delicate gold filigree.',
      featured: false,
    },
    {
      slug: 'enamel-bangle-stack',
      name: 'Enamel Bangle Stack',
      category: 'Kadas & Bangles',
      price: 8990000,
      image: '/images/bangles.png',
      material: '22k Gold • Meenakari Enamel',
      description: 'A vibrant stack of bangles showcasing traditional Rajasthani Meenakari enamel work.',
      featured: false,
    },
    {
      slug: 'kundan-maang-tikka',
      name: 'Kundan Maang Tikka',
      category: 'Maang Tikkas',
      price: 15990000,
      image: '/images/maangtikka.png',
      material: '24k Gold Polish • Glass Kundan',
      description: 'An oversized statement maang tikka perfect for bridal ceremonies and grand events.',
      featured: false,
    },
    {
      slug: 'paithani-haaram',
      name: 'Paithani Haaram',
      category: 'Harams & Sets',
      price: 21990000,
      image: '/images/necklace.png',
      material: '22k Gold • Ruby & Emerald Stones',
      description: 'Inspired by the weave of traditional Paithani sarees, this long necklace is a true heirloom.',
      featured: false,
    },
    {
      slug: 'gold-jhumki-earrings',
      name: 'Gold Jhumki Earrings',
      category: 'Jhumkas',
      price: 4490000,
      image: '/images/earrings.png',
      material: '22k Gold • Antique Finish',
      description: 'Versatile daily-wear jhumkis with a subtle antique finish for an understated classic look.',
      featured: false,
    },
  ];

  let skuCounter = 1;

  for (const prod of products) {
    const categoryId = categoryMap[prod.category];
    const categoryCode = prod.category === 'Harams & Sets' ? 'HAR'
      : prod.category === 'Jhumkas' ? 'JHM'
      : prod.category === 'Kadas & Bangles' ? 'KAD'
      : 'MTK';

    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
    if (existing) {
      console.log(`  ⏭ Product "${prod.name}" already exists, skipping`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        slug: prod.slug,
        name: prod.name,
        description: prod.description,
        material: prod.material,
        basePrice: prod.price,
        categoryId,
        isFeatured: prod.featured,
        variants: {
          create: {
            sku: `JC-${categoryCode}-${String(skuCounter).padStart(3, '0')}`,
            name: 'Default',
            price: prod.price,
            stock: 10,
          },
        },
        images: {
          create: {
            url: prod.image,
            alt: prod.name,
            isPrimary: true,
          },
        },
      },
    });

    skuCounter++;
    console.log(`  ✓ Product "${product.name}" created`);
  }

  console.log('\nSeed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
