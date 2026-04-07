import { getProducts, getCategories } from '@/lib/products';
import ShopClient from './ShopClient';

export const revalidate = 60;

export default async function ShopPage() {
    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    const categoryNames = ['All', ...categories.map((c: { name: string }) => c.name)];

    return <ShopClient products={products} categoryNames={categoryNames} />;
}
