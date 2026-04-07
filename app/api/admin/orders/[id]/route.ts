import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';
import { sendStatusUpdate } from '@/lib/email';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      shippingAddress: true,
      items: {
        include: {
          product: { select: { slug: true, images: { where: { isPrimary: true }, take: 1 } } },
        },
      },
    },
  });

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;
  const { id } = await params;

  const body = await request.json();
  const updateData: Record<string, unknown> = {};

  if (body.status) {
    updateData.status = body.status;
    if (body.status === 'SHIPPED') updateData.shippedAt = new Date();
    if (body.status === 'DELIVERED') updateData.deliveredAt = new Date();
    if (body.status === 'CANCELLED') updateData.cancelledAt = new Date();
  }

  if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus;
  if (body.note !== undefined) updateData.note = body.note;

  const order = await prisma.order.update({
    where: { id },
    data: updateData,
    include: { customer: true, items: true },
  });

  // Send status email for key transitions
  if (body.status && ['PROCESSING', 'DELIVERED', 'CANCELLED'].includes(body.status)) {
    sendStatusUpdate({
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      email: order.customer.email,
      orderNumber: order.orderNumber,
      status: body.status,
      trackingNumber: order.trackingNumber,
      courierName: order.courierName,
      items: order.items.map(i => ({ name: i.name, sku: i.sku, quantity: i.quantity, unitPrice: i.unitPrice })),
      totalAmount: order.totalAmount,
      deliveredAt: order.deliveredAt,
    }).catch(e => console.error('[order-status] Email failed:', e));
  }

  // If cancelled, restock items
  if (body.status === 'CANCELLED') {
    const items = await prisma.orderItem.findMany({ where: { orderId: id } });
    for (const item of items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });
      await prisma.stockAdjustment.create({
        data: {
          variantId: item.variantId,
          quantity: item.quantity,
          reason: 'ORDER_CANCELLED',
          note: `Order ${order.orderNumber} cancelled`,
        },
      });
    }
  }

  return NextResponse.json(order);
}
