import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const days = parseInt(searchParams.get('days') || '30');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      paymentStatus: 'PAID',
    },
    select: {
      totalAmount: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by day
  const dailyData: Record<string, { date: string; revenue: number; orders: number }> = {};
  for (const order of orders) {
    const day = order.createdAt.toISOString().slice(0, 10);
    if (!dailyData[day]) {
      dailyData[day] = { date: day, revenue: 0, orders: 0 };
    }
    dailyData[day].revenue += order.totalAmount;
    dailyData[day].orders += 1;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return NextResponse.json({
    summary: { totalRevenue, totalOrders, averageOrderValue, period: `${days} days` },
    daily: Object.values(dailyData),
  });
}
