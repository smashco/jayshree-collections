import { getProductBySlug, getRelatedProducts } from '@/lib/products';
import ProductPageClient from './ProductPageClient';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const product = await getProductBySlug(resolvedParams.id);
    if (!product) notFound();

    const related = await getRelatedProducts(product.categorySlug, product.slug);

    return <ProductPageClient product={product} relatedProducts={related} />;
}
