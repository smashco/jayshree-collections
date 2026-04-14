import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { sendOrderConfirmation } from '@/lib/email';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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
  shippingMethod: z.enum(['standard', 'express']).default('standard'),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
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
    console.log('[checkout] Received body keys:', Object.keys(body));
    console.log('[checkout] Items:', JSON.stringify(body.items));

    // Clean empty variantIds before validation
    if (Array.isArray(body.items)) {
      body.items = body.items.filter((i: { variantId?: string }) => i.variantId);
      if (body.items.length === 0) {
        return NextResponse.json({ error: 'Your cart has no valid items. Please clear your cart and re-add items from the shop.' }, { status: 400 });
      }
    }

    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      console.error('[checkout] Validation failed:', JSON.stringify(parsed.error.flatten(), null, 2));
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    console.log('[checkout] Validation passed, verifying Razorpay signature...');

    // Verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('[checkout] RAZORPAY_KEY_SECRET is not set!');
      return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== data.razorpaySignature) {
      console.error('[checkout] Signature mismatch. Expected:', expectedSignature, 'Got:', data.razorpaySignature);
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    console.log('[checkout] Signature verified. Checking for duplicate payment...');

    // Idempotency: prevent duplicate orders from same payment
    const existingOrder = await prisma.order.findFirst({
      where: { razorpayPaymentId: data.razorpayPaymentId },
    });
    if (existingOrder) {
      console.log('[checkout] Duplicate payment detected, returning existing order:', existingOrder.orderNumber);
      return NextResponse.json({
        orderId: existingOrder.id,
        orderNumber: existingOrder.orderNumber,
        totalAmount: existingOrder.totalAmount,
      }, { status: 200 });
    }

    console.log('[checkout] Looking up variants...');

    // Validate stock
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: data.items.map(i => i.variantId) } },
      include: { product: { select: { id: true, name: true } } },
    });

    console.log('[checkout] Found', variants.length, 'of', data.items.length, 'variants');

    for (const item of data.items) {
      const variant = variants.find(v => v.id === item.variantId);
      if (!variant) {
        console.error('[checkout] Variant not found:', item.variantId);
        return NextResponse.json({ error: 'One or more products are no longer available. Please clear your cart and try again.' }, { status: 400 });
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${variant.product.name}` }, { status: 400 });
      }
    }

    // Calculate amounts
    const shippingAmount = data.shippingMethod === 'express' ? 49900 : 0;
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

    const taxAmount = Math.round(subtotal * 0.03);
    const totalAmount = subtotal + taxAmount + shippingAmount;

    // Verify amount matches what Razorpay actually charged
    try {
      const razorpayOrder = await razorpay.orders.fetch(data.razorpayOrderId);
      const chargedAmount = Number(razorpayOrder.amount);
      if (chargedAmount !== totalAmount) {
        console.error('[checkout] Amount mismatch. Razorpay charged:', chargedAmount, 'Server computed:', totalAmount);
        return NextResponse.json({ error: 'Payment amount mismatch. Please contact support.' }, { status: 400 });
      }
      if (razorpayOrder.status !== 'paid') {
        console.error('[checkout] Razorpay order not paid. Status:', razorpayOrder.status);
        return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
      }
    } catch (err) {
      console.error('[checkout] Razorpay verification failed:', err);
      return NextResponse.json({ error: 'Unable to verify payment with Razorpay' }, { status: 500 });
    }

    console.log('[checkout] Amount verified. Creating order in DB...');

    const order = await prisma.$transaction(async (tx) => {
      let customer = await tx.customer.findUnique({ where: { email: data.email } });
      if (!customer) {
        customer = await tx.customer.create({
          data: { email: data.email, phone: data.phone, firstName: data.firstName, lastName: data.lastName },
        });
      }

      const address = await tx.address.create({
        data: {
          customerId: customer.id,
          firstName: data.firstName, lastName: data.lastName,
          address1: data.address1, address2: data.address2,
          city: data.city, state: data.state, pinCode: data.pinCode, phone: data.phone,
        },
      });

      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: customer.id,
          shippingAddressId: address.id,
          subtotal, taxAmount, shippingAmount, totalAmount,
          shippingMethod: data.shippingMethod,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          razorpayOrderId: data.razorpayOrderId,
          razorpayPaymentId: data.razorpayPaymentId,
          razorpaySignature: data.razorpaySignature,
          items: { create: orderItems },
        },
      });

      for (const item of data.items) {
        // Atomic: only decrement if stock is still sufficient. Prevents overselling under concurrent checkouts.
        const result = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          throw new Error(`STOCK_DEPLETED:${item.variantId}`);
        }
        await tx.stockAdjustment.create({
          data: { variantId: item.variantId, quantity: -item.quantity, reason: 'ORDER_PLACED', note: `Order ${order.orderNumber}` },
        });
      }

      return order;
    });

    console.log('[checkout] Order created:', order.orderNumber);

    // Send confirmation email (non-blocking)
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        customer: true,
        shippingAddress: true,
        items: true,
      },
    });

    if (fullOrder) {
      sendOrderConfirmation({
        customerName: `${fullOrder.customer.firstName} ${fullOrder.customer.lastName}`,
        email: fullOrder.customer.email,
        phone: fullOrder.customer.phone || undefined,
        orderNumber: fullOrder.orderNumber,
        paymentId: data.razorpayPaymentId,
        items: fullOrder.items.map(i => ({
          name: i.name,
          sku: i.sku,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        subtotal: fullOrder.subtotal,
        taxAmount: fullOrder.taxAmount,
        shippingAmount: fullOrder.shippingAmount,
        totalAmount: fullOrder.totalAmount,
        shippingMethod: fullOrder.shippingMethod,
        shippingAddress: fullOrder.shippingAddress,
        createdAt: fullOrder.createdAt,
      }).catch(err => console.error('[checkout] Email failed:', err));
    }

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber, totalAmount: order.totalAmount }, { status: 201 });

  } catch (err) {
    if (err instanceof Error && err.message.startsWith('STOCK_DEPLETED:')) {
      console.error('[checkout] Stock depleted during checkout:', err.message);
      return NextResponse.json({ error: 'Sorry, one of your items just sold out. Please refresh and try again. If payment was captured, we will issue a refund within 5-7 business days.' }, { status: 409 });
    }
    console.error('[checkout] Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
