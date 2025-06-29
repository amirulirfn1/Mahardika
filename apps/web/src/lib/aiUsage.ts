import { colors } from "@mahardika/ui";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Token limits by plan type
export const TOKEN_LIMITS = {
  starter: 50_000, // 50k tokens per month
  growth: 100_000, // 100k tokens per month
  scale: 500_000, // 500k tokens per month
} as const;

export type PlanType = keyof typeof TOKEN_LIMITS;

interface UsageResult {
  success: boolean;
  currentUsage: number;
  limit: number;
  remaining: number;
  error?: string;
}

/**
 * Check monthly AI usage for an agency and determine if they can make more requests
 */
export async function checkAiUsage(agencyId: string): Promise<UsageResult> {
  try {
    // Get agency plan type
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      select: { plan_type: true },
    });

    if (!agency) {
      return {
        success: false,
        currentUsage: 0,
        limit: 0,
        remaining: 0,
        error: 'Agency not found',
      };
    }

    const planType = agency.plan_type as PlanType;
    const limit = TOKEN_LIMITS[planType] || TOKEN_LIMITS.starter;

    // Calculate current month usage
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const usage = await prisma.aiUsage.aggregate({
      where: {
        agency_id: agencyId,
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        tokens: true,
      },
    });

    const currentUsage = usage._sum.tokens || 0;
    const remaining = Math.max(0, limit - currentUsage);
    const canProceed = currentUsage < limit;

    return {
      success: canProceed,
      currentUsage,
      limit,
      remaining,
      error: canProceed
        ? undefined
        : `Token limit exceeded for ${planType} plan`,
    };
  } catch (error) {
    console.error('Error checking AI usage:', error);
    return {
      success: false,
      currentUsage: 0,
      limit: 0,
      remaining: 0,
      error: 'Failed to check usage',
    };
  }
}

/**
 * Log AI usage after a successful API call
 */
export async function logAiUsage({
  agencyId,
  userId,
  model,
  tokens,
  inputText,
  outputText,
  language = 'en',
  requestId,
  cost,
}: {
  agencyId: string;
  userId?: string;
  model: string;
  tokens: number;
  inputText?: string;
  outputText?: string;
  language?: string;
  requestId?: string;
  cost?: number;
}) {
  try {
    await prisma.aiUsage.create({
      data: {
        agency_id: agencyId,
        user_id: userId,
        model,
        tokens,
        input_text: inputText,
        output_text: outputText,
        language,
        request_id: requestId,
        cost: cost ? cost.toString() : null,
        metadata: {
          timestamp: new Date().toISOString(),
          tokenBreakdown: {
            input: inputText ? estimateTokens(inputText) : 0,
            output: outputText ? estimateTokens(outputText) : 0,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error logging AI usage:', error);
    throw error;
  }
}

/**
 * Get monthly AI usage statistics for an agency
 */
export async function getMonthlyUsageStats(
  agencyId: string,
  year?: number,
  month?: number
) {
  const now = new Date();
  const targetYear = year || now.getFullYear();
  const targetMonth = month || now.getMonth();

  const startOfMonth = new Date(targetYear, targetMonth, 1);
  const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

  try {
    const stats = await prisma.aiUsage.aggregate({
      where: {
        agency_id: agencyId,
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        tokens: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        tokens: true,
      },
    });

    const dailyUsage = await prisma.aiUsage.groupBy({
      by: ['created_at'],
      where: {
        agency_id: agencyId,
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        tokens: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return {
      totalTokens: stats._sum.tokens || 0,
      totalRequests: stats._count || 0,
      averageTokensPerRequest: Math.round(stats._avg.tokens || 0),
      dailyBreakdown: dailyUsage.map(day => ({
        date: day.created_at.toISOString().split('T')[0],
        tokens: day._sum.tokens || 0,
      })),
    };
  } catch (error) {
    console.error('Error getting usage stats:', error);
    throw error;
  }
}

/**
 * Simple token estimation based on character count
 * This is a rough approximation - for production use OpenAI's tiktoken library
 */
function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token for English text
  return Math.ceil(text.length / 4);
}

/**
 * Get upgrade message based on current plan
 */
export function getUpgradeMessage(planType: string): string {
  const mahardikaColors = {
    navy: 'colors.navy',
    gold: 'colors.gold',
  };

  switch (planType) {
    case 'starter':
      return `🚀 You've reached your AI token limit! Upgrade to Growth plan for 100k tokens/month. Contact us to upgrade your Mahardika subscription.`;
    case 'growth':
      return `⚡ Token limit reached! Upgrade to Scale plan for 500k tokens/month. Contact us to unlock unlimited AI assistance.`;
    case 'scale':
      return `🎯 You've reached the Scale plan limit. Contact our enterprise team for custom solutions.`;
    default:
      return `📈 Upgrade your Mahardika plan to continue using AI features.`;
  }
}
