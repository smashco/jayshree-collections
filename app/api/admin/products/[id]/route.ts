import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';
import { updateProductSchema } from '@/lib/validators/product';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const body = await request.json();
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(product);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  // If ?force=true, archive the product instead of hard delete
  // (needed when product has historical orders)
  const force = request.nextUrl.searchParams.get('archive') === 'true';

  if (force) {
    await prisma.product.update({
      where: { id },
      data: { isActive: false, isFeatured: false },
    });
    return NextResponse.json({ success: true, archived: true });
  }

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, deleted: true });
  } catch (err: unknown) {
    // P2003 = foreign key constraint (product has order history)
    // P2025 = record not found
    const code = (err as { code?: string }).code;
    if (code === 'P2003') {
      return NextResponse.json({
        error: 'This product has existing orders and cannot be deleted. Archive it instead?',
        canArchive: true,
      }, { status: 409 });
    }
    if (code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    console.error('[admin:products:delete] unexpected:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
