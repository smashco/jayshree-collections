const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';
const TEST_MODE = process.env.SHIPROCKET_TEST_MODE === 'true';
const PICKUP_LOCATION = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getShiprocketToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Shiprocket auth failed: ${err}`);
  }

  const data = await res.json();
  cachedToken = data.token;
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // 9 days
  return cachedToken!;
}

export interface ShiprocketOrderPayload {
  orderNumber: string;
  orderDate: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string | null;
    city: string;
    state: string;
    pinCode: string;
  };
  items: {
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number; // in paisa — will be converted to rupees
  }[];
  subtotal: number;    // paisa
  totalAmount: number; // paisa
}

export async function createShiprocketOrder(payload: ShiprocketOrderPayload): Promise<{
  orderId: string;
  shipmentId: string;
  status: string;
}> {
  if (TEST_MODE) {
    const fakeId = `TEST-${Date.now()}`;
    console.log('[shiprocket:test] Fake order created for', payload.orderNumber);
    return { orderId: fakeId, shipmentId: `SHIP-${fakeId}`, status: 'NEW' };
  }

  const token = await getShiprocketToken();

  const body = {
    order_id: payload.orderNumber,
    order_date: new Date(payload.orderDate).toISOString().replace('T', ' ').slice(0, 19),
    pickup_location: PICKUP_LOCATION,
    billing_customer_name: payload.customer.firstName,
    billing_last_name: payload.customer.lastName,
    billing_address: payload.customer.address1,
    billing_address_2: payload.customer.address2 || '',
    billing_city: payload.customer.city,
    billing_pincode: payload.customer.pinCode,
    billing_state: payload.customer.state,
    billing_country: 'India',
    billing_email: payload.customer.email,
    billing_phone: payload.customer.phone || '',
    shipping_is_billing: true,
    order_items: payload.items.map(item => ({
      name: item.name,
      sku: item.sku,
      units: item.quantity,
      selling_price: Math.round(item.unitPrice / 100), // paisa → rupees
    })),
    payment_method: 'Prepaid',
    sub_total: Math.round(payload.subtotal / 100),
    length: 15,
    breadth: 10,
    height: 5,
    weight: 0.5,
  };

  const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok || !data.order_id) {
    throw new Error(data.message || 'Failed to create Shiprocket order');
  }

  return {
    orderId: String(data.order_id),
    shipmentId: String(data.shipment_id),
    status: data.status,
  };
}

export async function assignAWB(shipmentId: string): Promise<{
  awbCode: string;
  courierName: string;
}> {
  if (TEST_MODE) {
    console.log('[shiprocket:test] Fake AWB assigned for shipment', shipmentId);
    return { awbCode: `AWB-TEST-${Date.now()}`, courierName: 'Delhivery (Test)' };
  }

  const token = await getShiprocketToken();

  const res = await fetch(`${BASE_URL}/courier/assign/awb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shipment_id: shipmentId }),
  });

  const data = await res.json();
  if (!res.ok || !data.response?.data?.awb_code) {
    throw new Error(data.message || data.response?.data?.awb_assign_error || 'Failed to assign AWB');
  }

  return {
    awbCode: data.response.data.awb_code,
    courierName: data.response.data.courier_name || 'Unknown',
  };
}

export async function generatePickup(shipmentId: string): Promise<void> {
  if (TEST_MODE) {
    console.log('[shiprocket:test] Fake pickup scheduled for', shipmentId);
    return;
  }

  const token = await getShiprocketToken();

  const res = await fetch(`${BASE_URL}/courier/generate/pickup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shipment_id: [shipmentId] }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.error('[shiprocket] generatePickup failed:', errData);
    throw new Error(`Shiprocket pickup failed: ${res.status}`);
  }
}

export async function trackShipment(awbCode: string): Promise<{
  status: string;
  location: string;
  updatedAt: string;
  activities: { date: string; activity: string; location: string }[];
} | null> {
  const token = await getShiprocketToken();

  const res = await fetch(`${BASE_URL}/courier/track/awb/${awbCode}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  const data = await res.json();
  const tracking = data.tracking_data;
  if (!tracking) return null;

  const activities = (tracking.shipment_track_activities || []).map((a: Record<string, string>) => ({
    date: a.date,
    activity: a.activity,
    location: a.location,
  }));

  return {
    status: tracking.track_status || 'Unknown',
    location: tracking.current_status || '',
    updatedAt: tracking.delivered_date || tracking.etd || '',
    activities,
  };
}
