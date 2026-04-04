import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string; imageId: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id, imageId } = await params;

  await prisma.productImage.updateMany({
    where: { productId: id },
    data: { isPrimary: false },
  });

  await prisma.productImage.update({
    where: { id: imageId },
    data: { isPrimary: true },
  });

  return NextResponse.json({ success: true });
}
