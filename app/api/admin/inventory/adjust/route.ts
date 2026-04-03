import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';
import { z } from 'zod';

const adjustSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int(),
  reason: z.enum(['MANUAL', 'RESTOCK', 'DAMAGE', 'RETURN', 'CORRECTION']),
  note: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const parsed = adjustSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { variantId, quantity, reason, note } = parsed.data;

  const [adjustment] = await prisma.$transaction([
    prisma.stockAdjustment.create({
      data: {
        variantId,
        quantity,
        reason,
        note,
        staffId: session!.user.staffId,
      },
    }),
    prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: { increment: quantity } },
    }),
  ]);

  return NextResponse.json(adjustment, { status: 201 });
}
