import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const reviewSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(1).max(60),
  customerEmail: z.string().email(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(5).max(1000),
});

// GET /api/reviews?productId=xxx — fetch approved reviews for a product
export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId, isApproved: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      customerName: true,
      rating: true,
      title: true,
      comment: true,
      createdAt: true,
    },
  });

  const avg = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return NextResponse.json({ reviews, count: reviews.length, averageRating: Math.round(avg * 10) / 10 });
}

// POST /api/reviews — submit a new review (pending moderation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.review.create({ data: parsed.data });

    return NextResponse.json(
      { success: true, message: 'Thank you! Your review is pending approval.' },
      { status: 201 }
    );
  } catch (err) {
    console.error('[reviews] POST error:', err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
