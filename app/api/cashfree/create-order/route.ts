import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { createCashfreeOrder } from '@/lib/cashfree';

const SITE_URL = process.env.SITE_URL || 'https://jc-admin.services';

const initSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  shippingMethod: z.enum(['standard', 'express']).default('standard'),
  items: z.array(z.object({
    variantId: z.string().min(1),
    quantity: z.number().int().positive(),
  })).min(1),
});

function generateOrderNumber() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `JC-${dateStr}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = initSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    // Validate stock + compute amount server-side (never trust the client)
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: data.items.map(i => i.variantId) } },
      select: { id: true, price: true, stock: true, product: { select: { name: true } } },
    });

    if (variants.length !== data.items.length) {
      return NextResponse.json({ error: 'One or more items are unavailable. Please refresh your cart.' }, { status: 400 });
    }

    let subtotal = 0;
    for (const item of data.items) {
      const variant = variants.find(v => v.id === item.variantId);
      if (!variant) return NextResponse.json({ error: 'Item unavailable' }, { status: 400 });
      if (variant.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${variant.product.name}` }, { status: 400 });
      }
      subtotal += variant.price * item.quantity;
    }

    const shippingAmount = data.shippingMethod === 'express' ? 49900 : 0;
    const taxAmount = Math.round(subtotal * 0.03);
    const totalAmount = subtotal + taxAmount + shippingAmount;

    // Generate orderNumber, use as Cashfree order_id
    const orderNumber = generateOrderNumber();

    const cfOrder = await createCashfreeOrder({
      orderId: orderNumber,
      amount: totalAmount,
      customer: {
        id: data.email,
        email: data.email,
        phone: data.phone,
        name: `${data.firstName} ${data.lastName}`,
      },
      returnUrl: `${SITE_URL}/order-confirmation?order=${orderNumber}&email=${encodeURIComponent(data.email)}`,
      notifyUrl: `${SITE_URL}/api/cashfree/webhook`,
    });

    return NextResponse.json({
      paymentSessionId: cfOrder.payment_session_id,
      orderNumber,
      totalAmount,
    });
  } catch (err) {
    console.error('[cashfree:create-order] error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to create order';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
