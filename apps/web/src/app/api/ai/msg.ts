import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  checkAiUsage,
  logAiUsage,
  getUpgradeMessage,
} from '../../../lib/aiUsage';

const prisma = new PrismaClient();

interface MessageRequest {
  message: string;
  lang?: 'en' | 'ms';
  agencyId: string;
  userId?: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

const PROMPT_TEMPLATES = {
  en: {
    system: `You are a helpful AI assistant for the Mahardika Insurance Platform. 
    You specialize in insurance, policy management, and customer service.
    Always be professional, helpful, and use the Mahardika brand colors navy #0D1B2A and gold #F4B400 in your responses when appropriate.
    Provide concise and accurate information about insurance policies, claims, and general assistance.`,
    userPrefix: 'User question: ',
  },
  ms: {
    system: `Anda adalah pembantu AI yang berguna untuk Platform Insurans Mahardika.
    Anda pakar dalam insurans, pengurusan polisi, dan perkhidmatan pelanggan.
    Sentiasa bersikap profesional, membantu, dan gunakan warna jenama Mahardika navy #0D1B2A dan emas #F4B400 dalam respons anda bila sesuai.
    Berikan maklumat yang ringkas dan tepat tentang polisi insurans, tuntutan, dan bantuan umum.`,
    userPrefix: 'Soalan pengguna: ',
  },
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: MessageRequest = await request.json();
    const { message, lang = 'en', agencyId, userId } = body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (!agencyId) {
      return NextResponse.json(
        { error: 'Agency ID is required' },
        { status: 400 }
      );
    }

    // Check AI usage limits before proceeding
    const usageCheck = await checkAiUsage(agencyId);

    if (!usageCheck.success) {
      // Get agency plan type for proper upgrade message
      const agency = await prisma.agency.findUnique({
        where: { id: agencyId },
        select: { plan_type: true },
      });

      const upgradeMessage = getUpgradeMessage(agency?.plan_type || 'starter');

      return NextResponse.json(
        {
          error: 'Token limit exceeded',
          message: upgradeMessage,
          currentUsage: usageCheck.currentUsage,
          limit: usageCheck.limit,
          remaining: usageCheck.remaining,
        },
        { status: 402 } // Payment Required
      );
    }

    // Get DeepSeek API key
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekApiKey) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Get prompt template based on language
    const template = PROMPT_TEMPLATES[lang] || PROMPT_TEMPLATES.en;

    // Call DeepSeek API
    const response = await fetch(
      'https://api.deepseek.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${deepseekApiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: template.system,
            },
            {
              role: 'user',
              content: `${template.userPrefix}${message}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `DeepSeek API Error: ${response.status}` },
        { status: response.status }
      );
    }

    const data: DeepSeekResponse = await response.json();
    const aiResponse =
      data.choices?.[0]?.message?.content || 'No response generated';
    const tokensUsed =
      data.usage?.total_tokens || estimateTokens(message + aiResponse);

    // Log the usage
    try {
      await logAiUsage({
        agencyId,
        userId,
        model: 'deepseek-chat',
        tokens: tokensUsed,
        inputText: message,
        outputText: aiResponse,
        language: lang,
        requestId: crypto.randomUUID(),
      });
    } catch (error) {
      console.error('Failed to log AI usage:', error);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      text: aiResponse,
      language: lang,
      tokensUsed,
      usage: {
        current: usageCheck.currentUsage + tokensUsed,
        limit: usageCheck.limit,
        remaining: Math.max(0, usageCheck.remaining - tokensUsed),
      },
    });
  } catch (error) {
    console.error('AI Message API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Simple token estimation based on character count
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// GET method for health check
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    service: 'Mahardika AI Message API',
    version: '1.0.0',
    supportedLanguages: ['en', 'ms'],
    brandColors: {
      navy: '#0D1B2A',
      gold: '#F4B400',
    },
  });
}
