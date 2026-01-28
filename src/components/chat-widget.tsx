// file: src/components/chat-widget.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import type { Distro } from '@/types/distro.schema';

interface ChatWidgetProps {
  distro?: Distro;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'error';
  ollama?: {
    running: boolean;
    model: string;
    modelAvailable: boolean;
  };
  error?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isWelcome?: boolean;
  quickActions?: Array<{ label: string; text: string }>;
}

export function ChatWidget({ distro, skillLevel = 'beginner' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/ai/health');
      const data = await response.json();
      setHealth(data);
      return data as HealthStatus;
    } catch (error) {
      console.error('Failed to check health:', error);
      const fallback: HealthStatus = { status: 'error', error: 'Unable to reach AI service' } as HealthStatus;
      setHealth(fallback);
      return fallback;
    }
  };

  // Check Ollama health on mount
  useEffect(() => {
    if (isOpen) {
      fetchHealth();
      
      // Show welcome message on first open
      if (!hasShownWelcome) {
        const welcomeActions = [
          { label: 'Installation guide', text: 'Installation guide' },
          { label: 'Website usage', text: 'Website usage help' },
          { label: 'Contact developer', text: 'Contact developer' },
        ];

        setMessages([{
          role: 'assistant',
          content: "👋 Welcome! I can help you install a Linux distro, show you how to use this site, or connect you with the developer. Pick an option below.",
          isWelcome: true,
          quickActions: welcomeActions,
        }]);
        setHasShownWelcome(true);
      }
    }
  }, [isOpen, hasShownWelcome, skillLevel, distro]);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Ensure AI backend is healthy before sending
    const status = health || (await fetchHealth());
    if (!status || status.status !== 'healthy') {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '⚠️ The local AI service is offline. Please start Ollama with "ollama serve" and pull the configured model. Then reopen the assistant.',
        },
      ]);
      return;
    }

    const userMessage = message;
    setMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const lower = userMessage.toLowerCase();

      // Quick intents handled locally
      if (lower.includes('installation guide') || lower.startsWith('install')) {
        const distroName = distro?.name || 'your chosen distro';
        const installSteps = distro?.install_steps?.length
          ? distro.install_steps.map((s, i) => `${i + 1}. ${s.title} — ${s.detail_md}`).join('\n')
          : '1) Download ISO\n2) Verify checksum\n3) Create bootable USB (Rufus/Balena)\n4) Boot from USB and run installer\n5) Reboot and update the system';

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Here is an installation guide for ${distroName} (skill: ${skillLevel}):\n\n${installSteps}\n\nNeed a specific distro? Tell me the name and I will tailor the steps.`,
          },
        ]);
        return;
      }

      if (lower.includes('website usage') || lower.includes('website') || lower.includes('tour')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              '- Distros: Browse all distros with filters (family, desktop env, requirements).\n' +
              '- Compare: Pick two distros side-by-side on /distros/compare.\n' +
              '- Quiz: Use /distros/quiz for tailored recommendations.\n' +
              '- Checksums: Each distro page lists verified SHA256 and install steps.\n' +
              '- AI Help: Click the assistant for install or troubleshooting tips.',
          },
        ]);
        return;
      }

      if (lower.includes('contact developer') || lower.includes('contact')) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'You can reach the developer here:\n- LinkedIn: https://www.linkedin.com/in/sreeram-s-nair\n- Email: sreeramsnair4@gmail.com',
          },
        ]);
        return;
      }

      // Fetch with 120 second timeout (AI models can be slow)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage,
          distro_id: distro?.id,
          platform: 'windows', // Default, could be detected
          user_profile: { skill_level: skillLevel }, // respect incoming skill level
          allow_hosted_iso: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to get response');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer_md }]);
    } catch (error) {
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. The AI model is taking too long. Please try a shorter question.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ ${errorMessage}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatusIcon = () => {
    if (!health) return null;
    if (health.status === 'healthy') {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    }
    return <AlertCircle className="h-3 w-3 text-yellow-500" />;
  };

  if (!isOpen) {
    return (
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI assistant"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            AI Assistant {getHealthStatusIcon()}
          </CardTitle>
          <CardDescription className="text-xs">
            Ask about {distro?.name || 'Linux distributions'}
            {health && health.status !== 'healthy' && (
              <span className="block text-yellow-600 mt-1">{health.error}</span>
            )}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-80 space-y-3 overflow-y-auto rounded-md border p-3">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Hi! Ask me anything about installing or using {distro?.name || 'Linux'}.
            </p>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`text-sm ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block rounded-lg px-3 py-2 max-w-xs ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                {msg.content}
              </div>
              {msg.quickActions && msg.role === 'assistant' && (
                <div className="mt-2 space-y-2 text-left">
                  {msg.quickActions.map((action, actionIdx) => (
                    <Button
                      key={actionIdx}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => {
                        setMessage(action.text);
                        setMessages((prev) => [...prev, { role: 'user', content: action.text }]);
                        setTimeout(() => {
                          const inputElement = document.querySelector('input[placeholder="Ask a question..."]') as HTMLInputElement;
                          if (inputElement) inputElement.focus();
                        }, 0);
                      }}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="text-sm">
              <div className="inline-block animate-pulse rounded-lg bg-muted px-3 py-2">Thinking...</div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <Button onClick={handleSend} size="icon" disabled={loading || !message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
