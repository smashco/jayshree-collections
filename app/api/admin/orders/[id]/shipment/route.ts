import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createShiprocketOrder, assignAWB, generatePickup } from '@/lib/shiprocket';
import { sendShipmentNotification } from '@/lib/email';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      shippingAddress: true,
      items: true,
    },
  });

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (order.shiprocketOrderId) return NextResponse.json({ error: 'Shipment already created' }, { status: 400 });
  if (order.status === 'CANCELLED') return NextResponse.json({ error: 'Order is cancelled' }, { status: 400 });

  try {
    console.log('[shipment] Creating Shiprocket order for', order.orderNumber);

    // 1. Create order on Shiprocket
    const { orderId: shiprocketOrderId, shipmentId: shiprocketShipmentId } = await createShiprocketOrder({
      orderNumber: order.orderNumber,
      orderDate: order.createdAt.toISOString(),
      customer: {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        email: order.customer.email,
        phone: order.shippingAddress.phone || order.customer.phone || '',
        address1: order.shippingAddress.address1,
        address2: order.shippingAddress.address2,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pinCode: order.shippingAddress.pinCode,
      },
      items: order.items.map(i => ({
        name: i.name,
        sku: i.sku,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      subtotal: order.subtotal,
      totalAmount: order.totalAmount,
    });

    console.log('[shipment] Order created:', shiprocketOrderId, 'Shipment:', shiprocketShipmentId);

    // 2. Assign AWB (courier + tracking number)
    const { awbCode, courierName } = await assignAWB(shiprocketShipmentId);
    console.log('[shipment] AWB assigned:', awbCode, 'via', courierName);

    // 3. Generate pickup request
    await generatePickup(shiprocketShipmentId).catch(e => console.warn('[shipment] Pickup warning:', e));

    // 4. Update order in DB
    const updated = await prisma.order.update({
      where: { id },
      data: {
        shiprocketOrderId,
        shiprocketShipmentId,
        trackingNumber: awbCode,
        courierName,
        status: 'PROCESSING',
        shippedAt: new Date(),
      },
    });

    // 5. Send shipment email (non-blocking)
    sendShipmentNotification({
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      email: order.customer.email,
      orderNumber: order.orderNumber,
      awbCode,
      courierName,
    }).catch(e => console.error('[shipment] Email failed:', e));

    return NextResponse.json({
      shiprocketOrderId,
      shiprocketShipmentId,
      awbCode,
      courierName,
      status: updated.status,
    });

  } catch (err) {
    console.error('[shipment] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create shipment' },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  return NextResponse.json({
    shiprocketOrderId: order.shiprocketOrderId,
    shiprocketShipmentId: order.shiprocketShipmentId,
    awbCode: order.trackingNumber,
    courierName: order.courierName,
  });
}
