import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';

export async function GET() {
  const products = await getProducts({ featured: true, limit: 8 });
  return NextResponse.json(products);
}
