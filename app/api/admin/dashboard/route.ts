import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [
    totalProducts,
    totalCategories,
    totalOrders,
    totalCustomers,
    lowStockVariants,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.customer.count(),
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*)::bigint as count FROM product_variants
      WHERE is_active = true AND stock <= low_stock_threshold
    `.then((r) => Number(r[0]?.count ?? 0)),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: true },
    }),
  ]);

  // Revenue calculation
  const revenue = await prisma.order.aggregate({
    where: { paymentStatus: 'PAID' },
    _sum: { totalAmount: true },
  });

  return NextResponse.json({
    totalProducts,
    totalCategories,
    totalOrders,
    totalCustomers,
    lowStockVariants,
    totalRevenue: revenue._sum.totalAmount ?? 0,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      paymentStatus: o.paymentStatus,
      totalAmount: o.totalAmount,
      customerName: `${o.customer.firstName} ${o.customer.lastName}`,
      createdAt: o.createdAt,
    })),
  });
}
