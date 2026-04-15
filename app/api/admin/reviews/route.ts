import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';

// GET /api/admin/reviews?status=pending|approved|all
export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const status = request.nextUrl.searchParams.get('status') || 'all';
  const where = status === 'pending' ? { isApproved: false }
    : status === 'approved' ? { isApproved: true }
    : {};

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { product: { select: { id: true, name: true, slug: true } } },
  });

  return NextResponse.json(reviews);
}
