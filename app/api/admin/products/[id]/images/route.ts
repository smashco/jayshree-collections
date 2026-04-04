import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const { url, alt, isPrimary } = await request.json();

  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

  // If this is primary, unset existing primary
  if (isPrimary) {
    await prisma.productImage.updateMany({
      where: { productId: id },
      data: { isPrimary: false },
    });
  }

  const image = await prisma.productImage.create({
    data: {
      productId: id,
      url,
      alt: alt ?? null,
      isPrimary: isPrimary ?? false,
      sortOrder: 0,
    },
  });

  return NextResponse.json(image);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;

  const { imageId } = await request.json();
  await prisma.productImage.delete({ where: { id: imageId } });
  return NextResponse.json({ success: true });
}
