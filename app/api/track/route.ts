import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get('order');
  const email = request.nextUrl.searchParams.get('email');

  if (!orderNumber) {
    return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      customer: { select: { firstName: true, lastName: true, email: true } },
      shippingAddress: { select: { city: true, state: true, pinCode: true } },
      items: { select: { name: true, quantity: true, unitPrice: true } },
    },
  });

  // Return same 404 regardless of reason to prevent order number enumeration
  if (!order || order.customer.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  // Build timeline
  const timeline: { status: string; label: string; date: string | null; active: boolean }[] = [
    { status: 'CONFIRMED', label: 'Order Confirmed', date: order.createdAt.toISOString(), active: true },
  ];

  const statusOrder = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentIdx = statusOrder.indexOf(order.status);

  if (currentIdx >= 1 || order.status === 'PROCESSING') {
    timeline.push({ status: 'PROCESSING', label: 'Being Prepared', date: null, active: currentIdx >= 1 });
  } else {
    timeline.push({ status: 'PROCESSING', label: 'Being Prepared', date: null, active: false });
  }

  timeline.push({
    status: 'SHIPPED',
    label: 'Shipped',
    date: order.shippedAt?.toISOString() || null,
    active: currentIdx >= 2,
  });

  timeline.push({
    status: 'DELIVERED',
    label: 'Delivered',
    date: order.deliveredAt?.toISOString() || null,
    active: currentIdx >= 3,
  });

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    customerName: `${order.customer.firstName} ${order.customer.lastName}`,
    destination: `${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.pinCode}`,
    shippingMethod: order.shippingMethod,
    trackingNumber: order.trackingNumber,
    courierName: order.courierName,
    totalAmount: order.totalAmount,
    items: order.items,
    createdAt: order.createdAt,
    shippedAt: order.shippedAt,
    deliveredAt: order.deliveredAt,
    cancelledAt: order.cancelledAt,
    timeline,
  });
}
