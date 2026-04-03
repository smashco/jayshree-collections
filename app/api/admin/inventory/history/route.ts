import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const variantId = searchParams.get('variantId') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50');

  const adjustments = await prisma.stockAdjustment.findMany({
    where: variantId ? { variantId } : undefined,
    include: {
      variant: { include: { product: { select: { name: true } } } },
      staff: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return NextResponse.json(adjustments);
}
