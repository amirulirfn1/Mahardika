'use client';

import React, { useState } from 'react';
import { Button, Card, colors } from './index';

export interface AIChatProps {
  apiKey?: string;
  onMessage?: (message: string, response: string) => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIChat: React.FC<AIChatProps> = ({ apiKey, onMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (text: string, isUser: boolean): Message => {
    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
    return message;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    addMessage(userMessage, true);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          apiKey: apiKey || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || 'No response received';

      addMessage(aiResponse, false);
      onMessage?.(userMessage, aiResponse);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get AI response';
      setError(errorMessage);
      addMessage(`Error: ${errorMessage}`, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card
      title="Mahardika AI Assistant"
      subtitle="Powered by DeepSeek AI"
      variant="elevated"
      size="lg"
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      {/* Messages Area */}
      <div
        style={{
          height: '400px',
          overflowY: 'auto',
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          border: `1px solid ${colors.gold}`,
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: colors.gray[300],
              padding: '2rem',
            }}
          >
            <p>Welcome to Mahardika AI Assistant!</p>
            <p>Ask me anything about the Mahardika platform.</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              style={{
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: message.isUser
                    ? colors.gold
                    : 'rgba(255, 255, 255, 0.2)',
                  color: message.isUser ? colors.navy : colors.white,
                  fontSize: '0.875rem',
                  lineHeight: '1.4',
                }}
              >
                <div>{message.text}</div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    marginTop: '0.25rem',
                  }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div
            style={{
              textAlign: 'center',
              color: colors.gold,
              fontStyle: 'italic',
            }}
          >
            AI is thinking...
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            color: '#FCA5A5',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Input Area */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-end',
        }}
      >
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here... (Press Enter to send)"
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: `2px solid ${colors.gold}`,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: colors.white,
            fontFamily: 'inherit',
            fontSize: '0.875rem',
            resize: 'vertical',
            minHeight: '50px',
            maxHeight: '120px',
          }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          variant="secondary"
          size="lg"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </Card>
  );
};
