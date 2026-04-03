import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';
import { createVariantSchema } from '@/lib/validators/product';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const variants = await prisma.productVariant.findMany({
    where: { productId: id },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(variants);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const body = await request.json();
  const parsed = createVariantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const variant = await prisma.productVariant.create({
    data: { ...parsed.data, productId: id },
  });

  return NextResponse.json(variant, { status: 201 });
}
