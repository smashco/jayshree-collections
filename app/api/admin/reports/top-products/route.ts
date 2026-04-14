import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const items = await prisma.orderItem.findMany({
    where: { order: { paymentStatus: 'PAID' } },
    select: { productId: true, quantity: true, unitPrice: true },
  });

  const byProduct = new Map<string, { quantity: number; revenue: number }>();
  for (const it of items) {
    const prev = byProduct.get(it.productId) ?? { quantity: 0, revenue: 0 };
    prev.quantity += it.quantity;
    prev.revenue += it.quantity * it.unitPrice;
    byProduct.set(it.productId, prev);
  }

  const top = [...byProduct.entries()]
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 10);

  const products = await prisma.product.findMany({
    where: { id: { in: top.map(([id]) => id) } },
    select: { id: true, name: true, slug: true },
  });

  const result = top.map(([productId, stats]) => {
    const product = products.find(p => p.id === productId);
    return {
      productId,
      name: product?.name || 'Unknown',
      slug: product?.slug || '',
      totalQuantity: stats.quantity,
      totalRevenue: stats.revenue,
    };
  });

  return NextResponse.json(result);
}
