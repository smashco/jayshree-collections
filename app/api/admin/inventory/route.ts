import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const lowStockOnly = searchParams.get('lowStock') === 'true';

  const variants = await prisma.productVariant.findMany({
    where: {
      ...(lowStockOnly && { stock: { lte: 2 } }),
    },
    include: {
      product: { select: { name: true, slug: true, isActive: true } },
    },
    orderBy: [{ product: { name: 'asc' } }, { stock: 'asc' }],
  });

  // Also include products with no variants
  const productsWithNoVariants = await prisma.product.findMany({
    where: { variants: { none: {} } },
    select: { id: true, name: true, slug: true, isActive: true },
  });

  return NextResponse.json({ variants, productsWithNoVariants });
}
