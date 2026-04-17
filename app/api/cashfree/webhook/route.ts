import { NextRequest, NextResponse } from 'next/server';
import { verifyCashfreeWebhookSignature } from '@/lib/cashfree';
import { prisma } from '@/lib/prisma';

// Cashfree webhook events: PAYMENT_SUCCESS, PAYMENT_FAILED, PAYMENT_USER_DROPPED, etc.
// This is a safety-net: the main order creation happens in /api/checkout after user returns.
// This webhook just logs events and can update order state if the main flow missed.

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const timestamp = request.headers.get('x-webhook-timestamp') || '';
    const signature = request.headers.get('x-webhook-signature') || '';

    if (!timestamp || !signature) {
      console.error('[cashfree:webhook] Missing signature headers');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    if (!verifyCashfreeWebhookSignature(rawBody, timestamp, signature)) {
      console.error('[cashfree:webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload?.type || payload?.event;
    const orderData = payload?.data?.order;
    const paymentData = payload?.data?.payment;

    console.log('[cashfree:webhook]', eventType, orderData?.order_id);

    if (!orderData?.order_id) {
      return NextResponse.json({ received: true });
    }

    // If the main checkout flow didn't fire (user closed tab before redirect back),
    // we still mark the order paid from the webhook so admin sees it correctly.
    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' && paymentData?.payment_status === 'SUCCESS') {
      const existing = await prisma.order.findFirst({
        where: { cashfreeOrderId: orderData.order_id },
      });
      if (existing && existing.paymentStatus !== 'PAID') {
        await prisma.order.update({
          where: { id: existing.id },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
            cashfreePaymentId: paymentData.cf_payment_id ? String(paymentData.cf_payment_id) : null,
          },
        });
        console.log('[cashfree:webhook] Updated order to PAID:', existing.orderNumber);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[cashfree:webhook] error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
