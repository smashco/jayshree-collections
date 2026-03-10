import { catalog } from '@/lib/catalog';
import ProductPageClient from './ProductPageClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
    return catalog.map((product) => ({
        id: product.id,
    }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
    const product = catalog.find(p => p.id === params.id);
    if (!product) notFound();
    return <ProductPageClient id={params.id} />;
}
