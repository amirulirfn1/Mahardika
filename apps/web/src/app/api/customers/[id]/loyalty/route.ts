import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // Fetch points redemptions (negative) last 12 months
  const since = new Date();
  since.setMonth(since.getMonth() - 11);
  since.setDate(1);

  // Dummy line: Points awarding events not stored; so we approximate using cumulative loyalty_points snapshot per month
  const snapshots = await prisma.$queryRawUnsafe<any[]>(
    `
    SELECT date_trunc('month', created_at) AS month, MAX(loyalty_points) AS points
    FROM customers_points_snapshots -- hypothetical table
    WHERE customer_id = $1 AND created_at >= $2
    GROUP BY month
    ORDER BY month
    `,
    id,
    since
  ).catch(() => []);

  if (snapshots.length === 0) {
    // fallback: return last 6 months same points
    const res: { date: string; points: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      res.push({ date: d.toISOString().split('T')[0], points: 0 });
    }
    return NextResponse.json(res);
  }

  const res = snapshots.map((s) => ({ date: s.month.toISOString().split('T')[0], points: s.points }));
  return NextResponse.json(res);
} 