import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils/format';

export interface ProductListItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  formattedPrice: string;
  compareAtPrice: number | null;
  formattedCompareAtPrice: string | null;
  discountPercent: number | null;
  image: string;
  material: string;
  description: string;
}

export interface ProductDetail extends ProductListItem {
  images: { id: string; url: string; alt: string | null; isPrimary: boolean; mediaType: string }[];
  variants: {
    id: string;
    sku: string;
    name: string;
    size: string | null;
    weight: string | null;
    purity: string | null;
    price: number;
    formattedPrice: string;
    stock: number;
  }[];
}

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(options?.category && { category: { slug: options.category } }),
      ...(options?.featured && { isFeatured: true }),
      ...(options?.search && {
        OR: [
          { name: { contains: options.search, mode: 'insensitive' as const } },
          { material: { contains: options.search, mode: 'insensitive' as const } },
        ],
      }),
    },
    include: {
      category: true,
      images: { where: { isPrimary: true }, take: 1 },
      variants: { where: { isActive: true }, orderBy: { price: 'asc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
    take: options?.limit ?? 50,
    skip: options?.offset ?? 0,
  });

  return products.map((p) => {
    const lowestPrice = p.variants[0]?.price ?? p.basePrice;
    const compareAt = p.compareAt && p.compareAt > lowestPrice ? p.compareAt : null;
    const discountPercent = compareAt ? Math.round(((compareAt - lowestPrice) / compareAt) * 100) : null;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category.name,
      categorySlug: p.category.slug,
      price: lowestPrice,
      formattedPrice: formatPrice(lowestPrice),
      compareAtPrice: compareAt,
      formattedCompareAtPrice: compareAt ? formatPrice(compareAt) : null,
      discountPercent,
      image: p.images[0]?.url ?? '/images/placeholder.png',
      material: p.material ?? '',
      description: p.description ?? '',
    };
  });
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const p = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true }, orderBy: { price: 'asc' } },
    },
  });

  if (!p) return null;

  const lowestPrice = p.variants[0]?.price ?? p.basePrice;
  const compareAt = p.compareAt && p.compareAt > lowestPrice ? p.compareAt : null;
  const discountPercent = compareAt ? Math.round(((compareAt - lowestPrice) / compareAt) * 100) : null;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category.name,
    categorySlug: p.category.slug,
    price: lowestPrice,
    formattedPrice: formatPrice(lowestPrice),
    compareAtPrice: compareAt,
    formattedCompareAtPrice: compareAt ? formatPrice(compareAt) : null,
    discountPercent,
    image: p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url ?? '/images/placeholder.png',
    material: p.material ?? '',
    description: p.description ?? '',
    images: p.images.map((i) => ({
      id: i.id,
      url: i.url,
      alt: i.alt,
      isPrimary: i.isPrimary,
      mediaType: i.mediaType,
    })),
    variants: p.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      size: v.size,
      weight: v.weight,
      purity: v.purity,
      price: v.price,
      formattedPrice: formatPrice(v.price),
      stock: v.stock,
    })),
  };
}

export async function getRelatedProducts(categorySlug: string, currentSlug: string): Promise<ProductListItem[]> {
  return getProducts({ category: categorySlug, limit: 3 }).then((products) =>
    products.filter((p) => p.slug !== currentSlug).slice(0, 3)
  );
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, slug: true, description: true, image: true },
  });
}
