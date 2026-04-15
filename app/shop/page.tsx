import { getProducts, getCategories } from '@/lib/products';
import ShopClient from './ShopClient';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string }>;
}) {
    const params = await searchParams;
    const [products, categories] = await Promise.all([
        getProducts({ search: params.search, category: params.category }),
        getCategories(),
    ]);

    const categoryNames = ['All', ...categories.map((c: { name: string }) => c.name)];

    return <ShopClient products={products} categoryNames={categoryNames} initialSearch={params.search || ''} />;
}
