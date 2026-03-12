import { catalog } from '@/lib/catalog';
import ProductPageClient from './ProductPageClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
    return catalog.map((product) => ({
        id: product.id,
    }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const product = catalog.find(p => p.id === resolvedParams.id);
    if (!product) notFound();
    return <ProductPageClient id={resolvedParams.id} />;
}
