import crypto from 'crypto';

const ENV = (process.env.CASHFREE_ENV || 'TEST').toUpperCase();
export const CASHFREE_MODE: 'sandbox' | 'production' = ENV === 'PRODUCTION' ? 'production' : 'sandbox';

const BASE_URL = CASHFREE_MODE === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

const API_VERSION = '2023-08-01';

function requireCreds() {
  const appId = process.env.CASHFREE_APP_ID;
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secret) {
    throw new Error('CASHFREE_APP_ID and CASHFREE_SECRET_KEY must be set');
  }
  return { appId, secret };
}

function authHeaders() {
  const { appId, secret } = requireCreds();
  return {
    'Content-Type': 'application/json',
    'x-api-version': API_VERSION,
    'x-client-id': appId,
    'x-client-secret': secret,
  };
}

export interface CreateOrderPayload {
  orderId: string;        // our internal order number (JC-...)
  amount: number;         // in paise (will be converted to rupees)
  currency?: string;
  customer: {
    id: string;
    email: string;
    phone: string;
    name: string;
  };
  returnUrl?: string;
  notifyUrl?: string;
}

export interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  payment_session_id: string;
  order_status: string;
  order_amount: number;
}

export async function createCashfreeOrder(payload: CreateOrderPayload): Promise<CashfreeOrderResponse> {
  const rupees = Math.round(payload.amount) / 100;

  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      order_id: payload.orderId,
      order_amount: rupees,
      order_currency: payload.currency || 'INR',
      customer_details: {
        customer_id: payload.customer.id,
        customer_email: payload.customer.email,
        customer_phone: payload.customer.phone,
        customer_name: payload.customer.name,
      },
      order_note: 'Jayashri Collections',
      order_meta: {
        return_url: payload.returnUrl,
        notify_url: payload.notifyUrl,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('[cashfree] createOrder failed:', data);
    throw new Error(data.message || 'Failed to create Cashfree order');
  }
  return data as CashfreeOrderResponse;
}

export interface CashfreeOrderStatus {
  cf_order_id: string;
  order_id: string;
  order_status: 'PAID' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | string;
  order_amount: number;  // in rupees (decimal)
  order_currency: string;
}

export async function fetchCashfreeOrder(orderId: string): Promise<CashfreeOrderStatus> {
  const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('[cashfree] fetchOrder failed:', data);
    throw new Error(data.message || 'Failed to fetch Cashfree order');
  }
  return data as CashfreeOrderStatus;
}

export interface CashfreePayment {
  cf_payment_id: number;
  payment_status: 'SUCCESS' | 'FAILED' | 'PENDING' | string;
  payment_amount: number;
  payment_currency: string;
  payment_message?: string;
  payment_time?: string;
  payment_method?: Record<string, unknown>;
}

export async function fetchCashfreePayments(orderId: string): Promise<CashfreePayment[]> {
  const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}/payments`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('[cashfree] fetchPayments failed:', data);
    throw new Error(data.message || 'Failed to fetch Cashfree payments');
  }
  return data as CashfreePayment[];
}

// Webhook signature verification per Cashfree docs:
// signature = base64(HMAC-SHA256(timestamp + rawBody, secret_key))
export function verifyCashfreeWebhookSignature(rawBody: string, timestamp: string, receivedSignature: string): boolean {
  const { secret } = requireCreds();
  const expected = crypto
    .createHmac('sha256', secret)
    .update(timestamp + rawBody)
    .digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSignature));
  } catch {
    return false;
  }
}
