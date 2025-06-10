import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  getMonthlyUsageStats,
  TOKEN_LIMITS,
  type PlanType,
} from '../../../../lib/aiUsage';

const prisma = new PrismaClient();

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('agencyId');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!agencyId) {
      return NextResponse.json(
        { error: 'Agency ID is required' },
        { status: 400 }
      );
    }

    // Get agency information
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      select: {
        plan_type: true,
        name: true,
      },
    });

    if (!agency) {
      return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
    }

    const planType = agency.plan_type as PlanType;
    const limit = TOKEN_LIMITS[planType] || TOKEN_LIMITS.starter;

    // Get usage statistics
    const stats = await getMonthlyUsageStats(
      agencyId,
      year ? parseInt(year) : undefined,
      month ? parseInt(month) : undefined
    );

    const currentUsage = stats.totalTokens;
    const remaining = Math.max(0, limit - currentUsage);
    const percentage = Math.round((currentUsage / limit) * 100);

    return NextResponse.json({
      currentUsage,
      limit,
      remaining,
      percentage,
      planType,
      agencyName: agency.name,
      stats: {
        totalRequests: stats.totalRequests,
        averageTokensPerRequest: stats.averageTokensPerRequest,
        dailyBreakdown: stats.dailyBreakdown,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Usage API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
