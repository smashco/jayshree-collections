import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true, unitPrice: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 10,
  });

  const products = await prisma.product.findMany({
    where: { id: { in: topProducts.map(t => t.productId) } },
    select: { id: true, name: true, slug: true },
  });

  const result = topProducts.map(tp => {
    const product = products.find(p => p.id === tp.productId);
    return {
      productId: tp.productId,
      name: product?.name || 'Unknown',
      slug: product?.slug || '',
      totalQuantity: tp._sum.quantity || 0,
      totalRevenue: tp._sum.unitPrice || 0,
    };
  });

  return NextResponse.json(result);
}
