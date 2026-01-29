// file: src/app/api/ai/query/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AIResponseSchema } from '@/types/distro.schema';
import { loadDistro } from '@/lib/distro-loader';
import { generateResponse, checkOllamaHealth, OLLAMA_CONFIG } from '@/lib/ollama-client';
import { generateHuggingFaceResponse, checkHuggingFaceHealth, HF_CONFIG } from '@/lib/huggingface-client';

const RequestSchema = z.object({
  query: z.string().min(1).max(500),
  distro_id: z.string().optional(),
  platform: z.enum(['windows', 'wsl', 'macos', 'linux']),
  user_profile: z.object({
    skill_level: z.enum(['beginner', 'intermediate', 'advanced']),
  }),
  allow_hosted_iso: z.boolean().default(false),
  provider: z.enum(['huggingface', 'ollama', 'auto']).default('auto'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const body = await request.json();
    const validated = RequestSchema.parse(body);

    // Determine which provider to use
    let provider = validated.provider;
    let aiText = '';
    let usedProvider = '';

    // Load distro context if provided
    let distro = null;
    if (validated.distro_id) {
      distro = await loadDistro(validated.distro_id);
    }

    // Build context for AI
    const context = {
      distro,
      platform: validated.platform,
      user_profile: validated.user_profile,
      allow_hosted_iso: validated.allow_hosted_iso,
    };

    // Load system prompt
    const systemPrompt = await getSystemPrompt();
    const fullPrompt = `${systemPrompt}\n\nCONTEXT:\n${JSON.stringify(context, null, 2)}\n\n`;

    // Try to use Hugging Face if available (preferred for free cloud)
    if ((provider === 'auto' || provider === 'huggingface') && HF_CONFIG.enabled) {
      try {
        console.log('Using Hugging Face AI');
        aiText = await generateHuggingFaceResponse(validated.query, fullPrompt, {
          temperature: 0.7,
        });
        usedProvider = 'huggingface';
      } catch (hfError) {
        console.error('Hugging Face error:', hfError);
        if (provider === 'huggingface') {
          // User explicitly requested Hugging Face
          return NextResponse.json(
            {
              error: 'Failed to get response from Hugging Face',
              details: hfError instanceof Error ? hfError.message : 'Unknown error',
            },
            { status: 500 }
          );
        }
        // Fall through to Ollama if auto mode
      }
    }

    // Fallback to Ollama if Grok failed or not available
    if (!aiText) {
      const ollamaHealth = await checkOllamaHealth();
      if (!ollamaHealth.running || !ollamaHealth.modelAvailable) {
        return NextResponse.json(
          {
            answer_md:
              `⚠️ No AI provider available.\n\n` +
              (GROK_CONFIG.enabled ? `• Grok API failed\n` : `• Grok not configured\n`) +
              (HF_CONFIG.enabled ? `• Hugging Face API failed\n` : `• Hugging Face not configured\n`) +
              `• Local Ollama is offline\n\n` +
              `Options:\n` +
              `1. Start Ollama locally (free, offline):\n` +
              `   ollama serve\n` +
              `   ollama pull ${OLLAMA_CONFIG.model}\n\n` +
              `2. Or use Hugging Face (free, cloud):\n` +
              `   Get key: https://huggingface.co/settings/tokens\n` +
              `   Set: HUGGING_FACE_API_KEY environment variable`,
            steps: [],
            commands: [
              {
                command: `ollama serve`,
                platform: 'any',
                explanation: 'Start the local Ollama service',
                confirm_required: false,
              },
              {
                command: `ollama pull ${OLLAMA_CONFIG.model}`,
                platform: 'any',
                explanation: 'Download the Ollama model',
                confirm_required: false,
              },
            ],
            sources: [],
            followup: 'Try again after starting Ollama or configuring Hugging Face.',
            verification: null,
          },
          { status: 200 }
        );
      }

      try {
        console.log('Using Ollama AI');
        aiText = await generateResponse(validated.query, fullPrompt, {
          temperature: 0.7,
          top_p: 0.9,
        });
        usedProvider = 'ollama';
      } catch (ollamaError) {
        console.error('Ollama error:', ollamaError);
        return NextResponse.json(
          {
            error: 'Failed to get response from AI',
            details: 'Make sure Ollama is running with: ollama serve',
            model: OLLAMA_CONFIG.model,
          },
          { status: 500 }
        );
      }
    }

    // Parse AI response
    let aiResponse;
    try {
      // Try to extract JSON from response
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create structured response from text
        aiResponse = {
          answer_md: aiText,
          steps: [],
          commands: [],
          sources: distro
            ? [{ label: distro.name, url: distro.official_docs_url }]
            : [],
          followup: null,
          verification: null,
        };
      }
    } catch {
      aiResponse = {
        answer_md: aiText,
        steps: [],
        commands: [],
        sources: [],
        followup: null,
        verification: null,
      };
    }

    // Add provider info to response (for debugging)
    (aiResponse as any).provider = usedProvider;

    // Validate response schema
    const validatedResponse = AIResponseSchema.parse(aiResponse);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error('AI query error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getSystemPrompt(): Promise<string> {
  // This would load from /tools/ai/system_prompt.txt in production
  return `You are an expert, safety‑first Linux distribution assistant for a website cataloging all Linux‑based OSes. Use ONLY the provided CONTEXT (one distro or distros[] JSON entries, iso_files, install_steps, official URLs) plus general Linux knowledge. Be concise, factual, and always cite CONTEXT URLs for factual claims.

Required single‑object JSON response (no extra keys):
{
"answer_md": string,
"steps": [{id:string,title:string,detail_md:string,estimated_minutes:int,risk:"low"|"medium"|"high"}],
"commands": [{command:string,platform:string,explanation:string,confirm_required:boolean}],
"sources": [{label:string,url:string}],
"followup": string|null,
"verification": {checksum:string|null, iso_url:string|null, last_verified:string|null}
}

Behavior rules:
- Use only CONTEXT for facts
- Download section: if iso_files present, list filename, size, region, protocol, sha256
- Safety: NEVER provide destructive disk/partition commands unless user types exactly "I confirm I want destructive commands"
- Concision: default reply length — short (3–10 sentences or 3–8 steps)
- Citations: append [source: ] after each factual claim`;
}

// Removed unused buildPrompt function - prompt building is done inline
