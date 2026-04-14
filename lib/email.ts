import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'Jayshree Collections <onboarding@resend.dev>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jayshree-collections-production.up.railway.app';
const gold = '#BFA06A';
const dark = '#0A0A0A';
const lightText = '#F0E6C2';
const mutedText = '#888';

function formatRupees(paisa: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paisa / 100);
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ─── BASE TEMPLATE ─────────────────────────────────────
function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:${dark};border:1px solid #1a1a1a;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="padding:40px 48px 32px;border-bottom:1px solid #1a1a1a;text-align:center;">
            <a href="${SITE_URL}" style="text-decoration:none;">
              <p style="margin:0;font-size:13px;letter-spacing:8px;color:${gold};text-transform:uppercase;font-weight:400;">Jayshree Collections</p>
              <p style="margin:8px 0 0;font-size:9px;letter-spacing:4px;color:#444;text-transform:uppercase;">Luxury Jewellery · Since 1985</p>
            </a>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:40px 48px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:32px 48px;border-top:1px solid #1a1a1a;text-align:center;">
            <p style="margin:0;font-size:11px;color:#444;letter-spacing:2px;">
              <a href="${SITE_URL}/shop" style="color:${gold};text-decoration:none;">Shop</a>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <a href="${SITE_URL}/track" style="color:${gold};text-decoration:none;">Track Order</a>
            </p>
            <p style="margin:12px 0 0;font-size:10px;color:#333;letter-spacing:1px;">For queries, reply to this email or WhatsApp us.</p>
            <p style="margin:8px 0 0;font-size:9px;color:#222;letter-spacing:1px;">&copy; ${new Date().getFullYear()} Jayshree Collections. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── REUSABLE BLOCKS ───────────────────────────────────
function ctaButton(text: string, url: string) {
  return `<p style="text-align:center;margin:32px 0;">
    <a href="${url}" style="display:inline-block;background:${gold};color:#000;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:16px 40px;font-weight:700;">${text}</a>
  </p>`;
}

function infoRow(label: string, value: string, valueColor = '#F0E6C2') {
  return `<tr>
    <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;">
      <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">${label}</span>
      <span style="float:right;font-size:13px;color:${valueColor};font-weight:500;">${value}</span>
    </td>
  </tr>`;
}

function infoCard(rows: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1a1a1a;margin-bottom:32px;">
    ${rows}
  </table>`;
}

function sectionTitle(text: string) {
  return `<p style="margin:0 0 12px;font-size:10px;letter-spacing:4px;color:#555;text-transform:uppercase;">${text}</p>`;
}

function itemsTable(items: { name: string; sku: string; quantity: number; unitPrice: number }[]) {
  const rows = items.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #151515;">
        <p style="margin:0;color:${lightText};font-size:13px;font-weight:500;">${item.name}</p>
        <p style="margin:4px 0 0;color:#555;font-size:10px;letter-spacing:1px;">SKU: ${item.sku} &middot; Qty: ${item.quantity}</p>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #151515;text-align:right;color:${gold};font-size:13px;white-space:nowrap;vertical-align:top;">
        ${formatRupees(item.unitPrice * item.quantity)}
      </td>
    </tr>
  `).join('');
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${rows}</table>`;
}

function totalsTable(subtotal: number, taxAmount: number, shippingAmount: number, totalAmount: number) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
    <tr>
      <td style="padding:6px 0;font-size:13px;color:#666;">Subtotal</td>
      <td style="padding:6px 0;font-size:13px;color:#666;text-align:right;">${formatRupees(subtotal)}</td>
    </tr>
    <tr>
      <td style="padding:6px 0;font-size:13px;color:#666;">GST (3%)</td>
      <td style="padding:6px 0;font-size:13px;color:#666;text-align:right;">${formatRupees(taxAmount)}</td>
    </tr>
    <tr>
      <td style="padding:6px 0;font-size:13px;color:#666;">Shipping</td>
      <td style="padding:6px 0;font-size:13px;color:#666;text-align:right;">${shippingAmount === 0 ? 'Free' : formatRupees(shippingAmount)}</td>
    </tr>
    <tr>
      <td style="padding:14px 0 6px;font-size:16px;color:${gold};font-weight:600;border-top:1px solid #1a1a1a;">Total Paid</td>
      <td style="padding:14px 0 6px;font-size:16px;color:${gold};font-weight:600;text-align:right;border-top:1px solid #1a1a1a;">${formatRupees(totalAmount)}</td>
    </tr>
  </table>`;
}

function addressBlock(address: { firstName?: string; lastName?: string; address1: string; address2?: string | null; city: string; state: string; pinCode: string }) {
  const name = address.firstName ? `${address.firstName} ${address.lastName || ''}` : '';
  return `
    ${sectionTitle('Delivering To')}
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1a1a1a;margin-bottom:32px;">
      <tr><td style="padding:16px;">
        ${name ? `<p style="margin:0 0 4px;color:${lightText};font-size:13px;font-weight:600;">${name}</p>` : ''}
        <p style="margin:0;font-size:13px;color:#888;line-height:1.8;">
          ${address.address1}${address.address2 ? ', ' + address.address2 : ''}<br/>
          ${address.city}, ${address.state} &mdash; ${address.pinCode}<br/>
          India
        </p>
      </td></tr>
    </table>`;
}

function timelineStep(step: string, title: string, desc: string, active: boolean) {
  const color = active ? gold : '#333';
  const textColor = active ? lightText : '#555';
  return `<tr>
    <td style="padding:8px 0;vertical-align:top;width:36px;">
      <div style="width:24px;height:24px;border-radius:50%;background:${active ? gold : '#1a1a1a'};color:${active ? '#000' : '#444'};font-size:11px;font-weight:700;text-align:center;line-height:24px;">${step}</div>
    </td>
    <td style="padding:8px 0 8px 12px;">
      <p style="margin:0;font-size:13px;color:${textColor};font-weight:${active ? '600' : '400'};">${title}</p>
      <p style="margin:3px 0 0;font-size:11px;color:#555;">${desc}</p>
    </td>
  </tr>`;
}


// ═══════════════════════════════════════════════════════
// 1. ORDER CONFIRMATION
// ═══════════════════════════════════════════════════════
export interface OrderConfirmationData {
  customerName: string;
  email: string;
  phone?: string;
  orderNumber: string;
  paymentId: string;
  items: { name: string; sku: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  shippingMethod: string;
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    pinCode: string;
  };
  createdAt: string | Date;
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  const trackUrl = `${SITE_URL}/track?order=${encodeURIComponent(data.orderNumber)}&email=${encodeURIComponent(data.email)}`;
  const estimatedDelivery = data.shippingMethod === 'express' ? '1–2 business days' : '5–7 business days';

  const content = `
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:4px;color:${gold};text-transform:uppercase;">Payment Confirmed</p>
    <h1 style="margin:0 0 8px;font-size:28px;color:#fff;font-weight:300;line-height:1.2;">Thank you, ${data.customerName.split(' ')[0]}!</h1>
    <p style="margin:0 0 32px;font-size:13px;color:${mutedText};line-height:1.7;">
      Your order has been confirmed and our craftsmen have been notified. You'll receive tracking details once your jewellery is dispatched.
    </p>

    <!-- Order Details Card -->
    ${infoCard(
      infoRow('Order Number', data.orderNumber, gold) +
      infoRow('Payment ID', data.paymentId, '#777') +
      infoRow('Order Date', formatDate(data.createdAt)) +
      infoRow('Delivery Method', data.shippingMethod === 'express' ? 'Express (1–2 days)' : 'Standard (5–7 days)') +
      infoRow('Est. Delivery', estimatedDelivery, gold) +
      `<tr><td style="padding:12px 16px;">
        <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Status</span>
        <span style="float:right;font-size:12px;color:#4ade80;font-weight:600;letter-spacing:1px;">CONFIRMED &amp; PAID &#10003;</span>
      </td></tr>`
    )}

    <!-- Items -->
    ${sectionTitle('Your Items')}
    ${itemsTable(data.items)}

    <!-- Totals -->
    ${totalsTable(data.subtotal, data.taxAmount, data.shippingAmount, data.totalAmount)}

    <!-- Address -->
    ${addressBlock(data.shippingAddress)}

    <!-- Timeline -->
    ${sectionTitle('What Happens Next')}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      ${timelineStep('1', 'Order Confirmed', 'Payment verified and order locked in.', true)}
      ${timelineStep('2', 'Carefully Packed', 'Individually inspected and packed in our signature box.', false)}
      ${timelineStep('3', 'Shipped', 'Dispatched with tracking — email notification sent.', false)}
      ${timelineStep('4', 'Delivered', 'Insured delivery right to your door.', false)}
    </table>

    ${ctaButton('Track Your Order', trackUrl)}

    <p style="margin:0;font-size:11px;color:#444;line-height:1.7;text-align:center;">
      Save your order number <strong style="color:${gold};">${data.orderNumber}</strong> for reference.<br/>
      You can track your order anytime at <a href="${trackUrl}" style="color:${gold};text-decoration:underline;">${SITE_URL}/track</a>
    </p>
  `;

  console.log(`[email] Sending to ${data.email} via Resend API`);
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: `Order Confirmed — ${data.orderNumber} | Jayshree Collections`,
    html: baseTemplate(content),
  });
}


// ═══════════════════════════════════════════════════════
// 2. SHIPMENT / DISPATCHED NOTIFICATION
// ═══════════════════════════════════════════════════════
export interface ShipmentNotificationData {
  customerName: string;
  email: string;
  orderNumber: string;
  awbCode: string;
  courierName: string;
  shippingMethod?: string;
  items?: { name: string; sku: string; quantity: number; unitPrice: number }[];
  totalAmount?: number;
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    pinCode: string;
  };
  trackingUrl?: string;
}

export async function sendShipmentNotification(data: ShipmentNotificationData) {
  const trackUrl = data.trackingUrl || `${SITE_URL}/track?order=${encodeURIComponent(data.orderNumber)}&email=${encodeURIComponent(data.email)}`;
  const estimatedDelivery = data.shippingMethod === 'express' ? '1–2 business days' : '5–7 business days';

  const content = `
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:4px;color:${gold};text-transform:uppercase;">Your Order Is On Its Way</p>
    <h1 style="margin:0 0 8px;font-size:28px;color:#fff;font-weight:300;line-height:1.2;">Your jewellery has been dispatched!</h1>
    <p style="margin:0 0 32px;font-size:13px;color:${mutedText};line-height:1.7;">
      Great news, ${data.customerName.split(' ')[0]}! Your order <strong style="color:${lightText};">${data.orderNumber}</strong> has been handed over to <strong style="color:${lightText};">${data.courierName}</strong> and is on its way to you.
    </p>

    <!-- Tracking Card -->
    ${infoCard(
      infoRow('Order Number', data.orderNumber, gold) +
      infoRow('Courier Partner', data.courierName) +
      infoRow('AWB / Tracking No.', data.awbCode, gold) +
      infoRow('Est. Delivery', estimatedDelivery, gold) +
      `<tr><td style="padding:12px 16px;">
        <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Status</span>
        <span style="float:right;font-size:12px;color:#22d3ee;font-weight:600;letter-spacing:1px;">SHIPPED &#128230;</span>
      </td></tr>`
    )}

    ${ctaButton('Track Your Shipment', trackUrl)}

    <!-- Timeline -->
    ${sectionTitle('Delivery Progress')}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      ${timelineStep('1', 'Order Confirmed', 'Payment verified.', true)}
      ${timelineStep('2', 'Packed & Ready', 'Inspected and packed.', true)}
      ${timelineStep('3', 'Shipped', `Dispatched via ${data.courierName} — AWB: ${data.awbCode}`, true)}
      ${timelineStep('4', 'Out for Delivery', 'On its way to you.', false)}
    </table>

    ${data.items && data.items.length > 0 ? `
      ${sectionTitle('Items in This Shipment')}
      ${itemsTable(data.items)}
    ` : ''}

    ${data.totalAmount ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1a1a1a;margin-bottom:32px;">
        <tr><td style="padding:14px 16px;">
          <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Total Amount</span>
          <span style="float:right;font-size:16px;color:${gold};font-weight:600;">${formatRupees(data.totalAmount)}</span>
        </td></tr>
      </table>
    ` : ''}

    ${data.shippingAddress ? addressBlock(data.shippingAddress) : ''}

    <p style="margin:0;font-size:11px;color:#444;line-height:1.7;text-align:center;">
      Use AWB <strong style="color:${gold};">${data.awbCode}</strong> to track on the ${data.courierName} website.<br/>
      If you have any questions, just reply to this email.
    </p>
  `;

  console.log(`[email] Sending to ${data.email} via Resend API`);
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: `Shipped! ${data.orderNumber} · AWB ${data.awbCode} | Jayshree Collections`,
    html: baseTemplate(content),
  });
}


// ═══════════════════════════════════════════════════════
// 3. STATUS UPDATE EMAILS
// ═══════════════════════════════════════════════════════
export interface StatusUpdateData {
  customerName: string;
  email: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string | null;
  courierName?: string | null;
  items?: { name: string; sku: string; quantity: number; unitPrice: number }[];
  totalAmount?: number;
  deliveredAt?: string | Date | null;
}

export async function sendStatusUpdate(data: StatusUpdateData) {
  const trackUrl = `${SITE_URL}/track?order=${encodeURIComponent(data.orderNumber)}&email=${encodeURIComponent(data.email)}`;
  const firstName = data.customerName.split(' ')[0];

  let content = '';

  switch (data.status) {
    case 'PROCESSING':
      content = `
        <p style="margin:0 0 8px;font-size:10px;letter-spacing:4px;color:${gold};text-transform:uppercase;">Order Update</p>
        <h1 style="margin:0 0 8px;font-size:28px;color:#fff;font-weight:300;line-height:1.2;">We're preparing your order, ${firstName}.</h1>
        <p style="margin:0 0 32px;font-size:13px;color:${mutedText};line-height:1.7;">
          Your jewellery is being carefully inspected, polished, and packed in our signature gift box. We'll email you the moment it ships.
        </p>

        ${infoCard(
          infoRow('Order Number', data.orderNumber, gold) +
          `<tr><td style="padding:12px 16px;">
            <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Status</span>
            <span style="float:right;font-size:12px;color:#c084fc;font-weight:600;letter-spacing:1px;">PROCESSING &#9881;</span>
          </td></tr>`
        )}

        ${sectionTitle('Progress')}
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          ${timelineStep('1', 'Order Confirmed', 'Payment verified.', true)}
          ${timelineStep('2', 'Preparing Your Order', 'Being packed with care.', true)}
          ${timelineStep('3', 'Ready to Ship', 'Awaiting courier pickup.', false)}
          ${timelineStep('4', 'Delivered', 'On its way to your door.', false)}
        </table>

        ${ctaButton('Track Your Order', trackUrl)}
      `;
      break;

    case 'DELIVERED':
      content = `
        <p style="margin:0 0 8px;font-size:10px;letter-spacing:4px;color:#4ade80;text-transform:uppercase;">Delivered</p>
        <h1 style="margin:0 0 8px;font-size:28px;color:#fff;font-weight:300;line-height:1.2;">Your jewellery has arrived, ${firstName}!</h1>
        <p style="margin:0 0 32px;font-size:13px;color:${mutedText};line-height:1.7;">
          Your order <strong style="color:${lightText};">${data.orderNumber}</strong> has been delivered. We hope you absolutely love your new piece.
        </p>

        ${infoCard(
          infoRow('Order Number', data.orderNumber, gold) +
          (data.courierName ? infoRow('Courier', data.courierName) : '') +
          (data.trackingNumber ? infoRow('AWB', data.trackingNumber, gold) : '') +
          (data.deliveredAt ? infoRow('Delivered On', formatDateTime(data.deliveredAt)) : '') +
          `<tr><td style="padding:12px 16px;">
            <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Status</span>
            <span style="float:right;font-size:12px;color:#4ade80;font-weight:600;letter-spacing:1px;">DELIVERED &#10003;</span>
          </td></tr>`
        )}

        ${sectionTitle('Delivery Complete')}
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          ${timelineStep('1', 'Order Confirmed', 'Payment verified.', true)}
          ${timelineStep('2', 'Packed', 'Inspected and packed.', true)}
          ${timelineStep('3', 'Shipped', `Via ${data.courierName || 'courier'}`, true)}
          ${timelineStep('4', 'Delivered', data.deliveredAt ? formatDateTime(data.deliveredAt) : 'Successfully delivered!', true)}
        </table>

        ${data.items && data.items.length > 0 ? `
          ${sectionTitle('What You Received')}
          ${itemsTable(data.items)}
        ` : ''}

        ${data.totalAmount ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1a1a1a;margin-bottom:32px;">
            <tr><td style="padding:14px 16px;">
              <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Total Paid</span>
              <span style="float:right;font-size:16px;color:${gold};font-weight:600;">${formatRupees(data.totalAmount)}</span>
            </td></tr>
          </table>
        ` : ''}

        <p style="margin:0 0 32px;font-size:13px;color:${mutedText};line-height:1.7;text-align:center;">
          We'd love to hear your feedback! If there's anything wrong with your order, please reply to this email within 7 days.
        </p>

        ${ctaButton('Continue Shopping', `${SITE_URL}/shop`)}
      `;
      break;

    case 'CANCELLED':
      content = `
        <p style="margin:0 0 8px;font-size:10px;letter-spacing:4px;color:#f87171;text-transform:uppercase;">Order Cancelled</p>
        <h1 style="margin:0 0 8px;font-size:28px;color:#fff;font-weight:300;line-height:1.2;">Your order has been cancelled.</h1>
        <p style="margin:0 0 32px;font-size:13px;color:${mutedText};line-height:1.7;">
          Order <strong style="color:${lightText};">${data.orderNumber}</strong> has been cancelled. If payment was already processed, a full refund will be initiated within <strong style="color:${lightText};">5–7 business days</strong> to your original payment method.
        </p>

        ${infoCard(
          infoRow('Order Number', data.orderNumber, gold) +
          (data.totalAmount ? infoRow('Refund Amount', formatRupees(data.totalAmount), '#f87171') : '') +
          `<tr><td style="padding:12px 16px;">
            <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Status</span>
            <span style="float:right;font-size:12px;color:#f87171;font-weight:600;letter-spacing:1px;">CANCELLED &#10005;</span>
          </td></tr>`
        )}

        <p style="margin:0 0 32px;font-size:13px;color:${mutedText};line-height:1.7;text-align:center;">
          If this was a mistake or you have questions about the refund, reply to this email or contact our support.
        </p>

        ${ctaButton('Return to Shop', `${SITE_URL}/shop`)}
      `;
      break;

    default:
      return; // Unknown status, don't send
  }

  const subjectMap: Record<string, string> = {
    PROCESSING: `Being Prepared — ${data.orderNumber}`,
    DELIVERED: `Delivered! — ${data.orderNumber}`,
    CANCELLED: `Cancelled — ${data.orderNumber}`,
  };

  console.log(`[email] Sending to ${data.email} via Resend API`);
  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: `${subjectMap[data.status] || data.status} | Jayshree Collections`,
    html: baseTemplate(content),
  });
}
