import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const checkoutSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pinCode: z.string().min(1),
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
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Validate stock
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: data.items.map(i => i.variantId) } },
    include: { product: { select: { id: true, name: true } } },
  });

  for (const item of data.items) {
    const variant = variants.find(v => v.id === item.variantId);
    if (!variant) {
      return NextResponse.json({ error: `Variant ${item.variantId} not found` }, { status: 400 });
    }
    if (variant.stock < item.quantity) {
      return NextResponse.json({ error: `Insufficient stock for ${variant.product.name}` }, { status: 400 });
    }
  }

  // Calculate amounts
  let subtotal = 0;
  const orderItems = data.items.map(item => {
    const variant = variants.find(v => v.id === item.variantId)!;
    const lineTotal = variant.price * item.quantity;
    subtotal += lineTotal;
    return {
      productId: variant.product.id,
      variantId: variant.id,
      quantity: item.quantity,
      unitPrice: variant.price,
      name: variant.product.name,
      sku: variant.sku,
    };
  });

  const taxAmount = Math.round(subtotal * 0.03); // 3% GST
  const totalAmount = subtotal + taxAmount;

  // Create everything in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Find or create customer
    let customer = await tx.customer.findUnique({ where: { email: data.email } });
    if (!customer) {
      customer = await tx.customer.create({
        data: {
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
    }

    // Create address
    const address = await tx.address.create({
      data: {
        customerId: customer.id,
        firstName: data.firstName,
        lastName: data.lastName,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
        phone: data.phone,
      },
    });

    // Create order
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        shippingAddressId: address.id,
        subtotal,
        taxAmount,
        totalAmount,
        items: { create: orderItems },
      },
    });

    // Decrement stock
    for (const item of data.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
      await tx.stockAdjustment.create({
        data: {
          variantId: item.variantId,
          quantity: -item.quantity,
          reason: 'ORDER_PLACED',
          note: `Order ${order.orderNumber}`,
        },
      });
    }

    return order;
  });

  // In production, you'd create a Razorpay order here
  // For now, return the order with a placeholder
  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    totalAmount: order.totalAmount,
    // razorpayOrderId would go here
  }, { status: 201 });
}
