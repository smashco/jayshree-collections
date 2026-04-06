import nodemailer from 'nodemailer';

function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP_USER and SMTP_PASS env vars are not configured');
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = `Jayshree Collections <${process.env.SMTP_USER}>`;

const gold = '#BFA06A';
const dark = '#0A0A0A';

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
            <p style="margin:0;font-size:11px;letter-spacing:6px;color:${gold};text-transform:uppercase;font-weight:400;">Jayshree Collections</p>
            <p style="margin:8px 0 0;font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Luxury Jewellery</p>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:40px 48px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 48px;border-top:1px solid #1a1a1a;text-align:center;">
            <p style="margin:0;font-size:10px;color:#333;letter-spacing:2px;">For queries, reply to this email</p>
            <p style="margin:8px 0 0;font-size:9px;color:#222;letter-spacing:1px;">© ${new Date().getFullYear()} Jayshree Collections. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function divider() {
  return `<tr><td style="padding:16px 0;"><div style="border-top:1px solid #1a1a1a;"></div></td></tr>`;
}

export interface OrderConfirmationData {
  customerName: string;
  email: string;
  orderNumber: string;
  paymentId: string;
  items: { name: string; sku: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  shippingAddress: {
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    pinCode: string;
  };
}

function formatRupees(paisa: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paisa / 100);
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  const itemRows = data.items.map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #111;">
        <p style="margin:0;color:#F0E6C2;font-size:13px;">${item.name}</p>
        <p style="margin:4px 0 0;color:#555;font-size:11px;letter-spacing:1px;">SKU: ${item.sku} · Qty: ${item.quantity}</p>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #111;text-align:right;color:${gold};font-size:13px;white-space:nowrap;">
        ${formatRupees(item.unitPrice * item.quantity)}
      </td>
    </tr>
  `).join('');

  const content = `
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:4px;color:${gold};text-transform:uppercase;">Payment Confirmed</p>
    <h1 style="margin:0 0 24px;font-size:28px;color:#fff;font-weight:300;line-height:1.2;">Thank you for your order, ${data.customerName.split(' ')[0]}.</h1>
    <p style="margin:0 0 32px;font-size:13px;color:#888;line-height:1.7;">
      Your order has been confirmed and our craftsmen have been notified. We will send you shipping details once your piece is dispatched.
    </p>

    <!-- Order Details -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1a1a1a;margin-bottom:32px;">
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;">
          <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Order Number</span>
          <span style="float:right;font-size:13px;color:${gold};font-weight:600;">${data.orderNumber}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px;">
          <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Payment ID</span>
          <span style="float:right;font-size:11px;color:#666;">${data.paymentId}</span>
        </td>
      </tr>
    </table>

    <!-- Items -->
    <p style="margin:0 0 12px;font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Your Items</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${itemRows}
    </table>

    <!-- Totals -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#666;">Subtotal</td>
        <td style="padding:6px 0;font-size:13px;color:#666;text-align:right;">${formatRupees(data.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#666;">GST (3%)</td>
        <td style="padding:6px 0;font-size:13px;color:#666;text-align:right;">${formatRupees(data.taxAmount)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#666;">Shipping</td>
        <td style="padding:6px 0;font-size:13px;color:#666;text-align:right;">${data.shippingAmount === 0 ? 'Free' : formatRupees(data.shippingAmount)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 6px;font-size:15px;color:${gold};font-weight:600;border-top:1px solid #1a1a1a;">Total</td>
        <td style="padding:12px 0 6px;font-size:15px;color:${gold};font-weight:600;text-align:right;border-top:1px solid #1a1a1a;">${formatRupees(data.totalAmount)}</td>
      </tr>
    </table>

    <!-- Shipping Address -->
    <p style="margin:0 0 12px;font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Delivering To</p>
    <p style="margin:0;font-size:13px;color:#888;line-height:1.8;">
      ${data.shippingAddress.address1}${data.shippingAddress.address2 ? ', ' + data.shippingAddress.address2 : ''}<br/>
      ${data.shippingAddress.city}, ${data.shippingAddress.state} — ${data.shippingAddress.pinCode}
    </p>
  `;

  await getTransporter().sendMail({
    from: FROM,
    to: data.email,
    subject: `Order Confirmed — ${data.orderNumber} | Jayshree Collections`,
    html: baseTemplate(content),
  });
}

export interface ShipmentNotificationData {
  customerName: string;
  email: string;
  orderNumber: string;
  awbCode: string;
  courierName: string;
  trackingUrl?: string;
}

export async function sendShipmentNotification(data: ShipmentNotificationData) {
  const content = `
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:4px;color:${gold};text-transform:uppercase;">Your Order Is On Its Way</p>
    <h1 style="margin:0 0 24px;font-size:28px;color:#fff;font-weight:300;line-height:1.2;">Your jewellery has been dispatched.</h1>
    <p style="margin:0 0 32px;font-size:13px;color:#888;line-height:1.7;">
      Great news! Your order <strong style="color:#F0E6C2;">${data.orderNumber}</strong> has been handed over to ${data.courierName} and is on its way to you.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1a1a1a;margin-bottom:32px;">
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;">
          <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Courier</span>
          <span style="float:right;font-size:13px;color:#F0E6C2;">${data.courierName}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px;">
          <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">AWB / Tracking No.</span>
          <span style="float:right;font-size:13px;color:${gold};font-weight:600;">${data.awbCode}</span>
        </td>
      </tr>
    </table>

    ${data.trackingUrl ? `<p style="text-align:center;margin:0 0 32px;"><a href="${data.trackingUrl}" style="display:inline-block;background:${gold};color:#000;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:14px 32px;font-weight:700;">Track Your Order</a></p>` : ''}

    <p style="margin:0;font-size:12px;color:#555;line-height:1.7;">
      You can use the AWB number to track your shipment on the ${data.courierName} website. If you have any questions, reply to this email.
    </p>
  `;

  await getTransporter().sendMail({
    from: FROM,
    to: data.email,
    subject: `Shipped — ${data.orderNumber} · ${data.awbCode} | Jayshree Collections`,
    html: baseTemplate(content),
  });
}

export interface StatusUpdateData {
  customerName: string;
  email: string;
  orderNumber: string;
  status: string;
}

const STATUS_MESSAGES: Record<string, { subject: string; heading: string; body: string }> = {
  PROCESSING: {
    subject: 'Your order is being prepared',
    heading: 'We are preparing your order.',
    body: 'Your jewellery is currently being carefully inspected, packaged, and prepared for dispatch. We will notify you once it has been shipped.',
  },
  DELIVERED: {
    subject: 'Your order has been delivered',
    heading: 'Your jewellery has arrived.',
    body: 'Your order has been marked as delivered. We hope you love your new piece. If you have any questions or concerns, please reply to this email.',
  },
  CANCELLED: {
    subject: 'Your order has been cancelled',
    heading: 'Your order has been cancelled.',
    body: 'Your order has been cancelled. If a payment was made, a refund will be processed within 5–7 business days to your original payment method. Please reply to this email if you have any questions.',
  },
};

export async function sendStatusUpdate(data: StatusUpdateData) {
  const template = STATUS_MESSAGES[data.status];
  if (!template) return;

  const content = `
    <h1 style="margin:0 0 24px;font-size:28px;color:#fff;font-weight:300;line-height:1.2;">${template.heading}</h1>
    <p style="margin:0 0 24px;font-size:13px;color:#888;line-height:1.7;">${template.body}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1a1a1a;">
      <tr>
        <td style="padding:12px 16px;">
          <span style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;">Order Number</span>
          <span style="float:right;font-size:13px;color:${gold};font-weight:600;">${data.orderNumber}</span>
        </td>
      </tr>
    </table>
  `;

  await getTransporter().sendMail({
    from: FROM,
    to: data.email,
    subject: `${template.subject} — ${data.orderNumber} | Jayshree Collections`,
    html: baseTemplate(content),
  });
}
