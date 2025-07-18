import { colors } from '@mahardika/ui';
import { NextRequest, NextResponse } from 'next/server';
import {
  withRateLimit,
  aiMessageRateLimit,
} from '@mah/core/security/rateLimit';
import { csrfProtection } from '@mah/core/security/csrf';

interface ChatRequest {
  message: string;
  apiKey?: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function handleChat(request: NextRequest): Promise<NextResponse> {
  try {
    const { message, apiKey }: ChatRequest = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const deepseekApiKey = apiKey || process.env.DEEPSEEK_API_KEY;

    if (!deepseekApiKey) {
      return NextResponse.json(
        { error: 'DEEPSEEK_API_KEY is not configured' },
        { status: 500 }
      );
    }

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
              content:
                'You are a helpful AI assistant for the Mahardika platform. Provide concise and helpful responses about UI components, design systems, and development with navy colors.navy and gold colors.gold brand colors.',
            },
            {
              role: 'user',
              content: message,
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

    return NextResponse.json(
      {
        response: aiResponse,
        timestamp: new Date().toISOString(),
        service: 'Mahardika AI Chat',
        colors: {
          navy: 'colors.navy',
          gold: 'colors.gold',
        },
      },
      {
        headers: {
          'X-Mahardika-Service': 'ai-chat',
        },
      }
    );
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        service: 'Mahardika AI Chat',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Export rate-limited and CSRF protected handler
export const POST = csrfProtection(
  withRateLimit(aiMessageRateLimit, handleChat)
);
