import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';
import { createCategorySchema } from '@/lib/validators/product';

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { products: true } },
      parent: { select: { id: true, name: true } },
      children: {
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: { select: { products: true } },
          children: {
            orderBy: { sortOrder: 'asc' },
            include: { _count: { select: { products: true } } },
          },
        },
      },
    },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { name, slug, sortOrder, parentId } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { name, slug, sortOrder: sortOrder || 0, parentId: parentId || null },
  });
  return NextResponse.json(category, { status: 201 });
}
