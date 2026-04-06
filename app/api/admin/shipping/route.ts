import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const tab = request.nextUrl.searchParams.get('tab') || 'all';

  const where: Record<string, unknown> = {};
  if (tab === 'pending') where.shiprocketOrderId = null;
  if (tab === 'shipped') where.shiprocketOrderId = { not: null };
  if (tab === 'delivered') where.status = 'DELIVERED';

  // Exclude cancelled
  if (tab !== 'all') {
    where.status = where.status || { not: 'CANCELLED' };
  }

  try {
    const [orders, stats] = await Promise.all([
      prisma.order.findMany({
        where: { paymentStatus: 'PAID', ...where },
        include: {
          customer: true,
          shippingAddress: true,
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      Promise.all([
        prisma.order.count({ where: { paymentStatus: 'PAID', shiprocketOrderId: null, status: { notIn: ['CANCELLED', 'DELIVERED'] } } }),
        prisma.order.count({ where: { paymentStatus: 'PAID', shiprocketOrderId: { not: null }, status: { notIn: ['DELIVERED', 'CANCELLED'] } } }),
        prisma.order.count({ where: { paymentStatus: 'PAID', status: 'DELIVERED' } }),
      ]),
    ]);

    return NextResponse.json({
      orders: orders.map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        customerName: `${o.customer.firstName} ${o.customer.lastName}`,
        city: o.shippingAddress.city,
        state: o.shippingAddress.state,
        pinCode: o.shippingAddress.pinCode,
        totalAmount: o.totalAmount,
        itemCount: o._count.items,
        shiprocketOrderId: o.shiprocketOrderId,
        trackingNumber: o.trackingNumber,
        courierName: o.courierName,
        shippingMethod: o.shippingMethod,
        shippedAt: o.shippedAt,
        deliveredAt: o.deliveredAt,
        createdAt: o.createdAt,
      })),
      stats: {
        pendingShipment: stats[0],
        inTransit: stats[1],
        delivered: stats[2],
      },
    });
  } catch (err) {
    console.error('[shipping] Error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}
