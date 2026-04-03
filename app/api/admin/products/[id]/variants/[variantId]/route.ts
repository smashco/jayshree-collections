import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { variantId } = await params;

  const body = await request.json();
  const variant = await prisma.productVariant.update({
    where: { id: variantId },
    data: body,
  });

  return NextResponse.json(variant);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { variantId } = await params;

  await prisma.productVariant.delete({ where: { id: variantId } });
  return NextResponse.json({ success: true });
}
