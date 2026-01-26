// file: src/app/api/ai/query/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AIResponseSchema } from '@/types/distro.schema';
import { loadDistro } from '@/lib/distro-loader';
import { generateResponse, checkOllamaHealth, OLLAMA_CONFIG } from '@/lib/ollama-client';

const RequestSchema = z.object({
  query: z.string().min(1).max(500),
  distro_id: z.string().optional(),
  platform: z.enum(['windows', 'wsl', 'macos', 'linux']),
  user_profile: z.object({
    skill_level: z.enum(['beginner', 'intermediate', 'advanced']),
  }),
  allow_hosted_iso: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    // Check Ollama health first
    const health = await checkOllamaHealth();
    if (!health.running || !health.modelAvailable) {
      return NextResponse.json(
        { 
          error: 'Ollama service unavailable', 
          details: health.error,
          model: OLLAMA_CONFIG.model,
        },
        { status: 503 }
      );
    }

    // Rate limiting disabled - lru-cache module issues
    // const identifier = request.ip || 'anonymous';
    // const { success } = await rateLimit(identifier);
    // if (!success) {
    //   return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    // }

    // Parse and validate request
    const body = await request.json();
    const validated = RequestSchema.parse(body);

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

    // Call Ollama using the helper function
    let aiText = '';
    try {
      aiText = await generateResponse(validated.query, `${systemPrompt}\n\nCONTEXT:\n${JSON.stringify(context, null, 2)}\n\n`, {
        temperature: 0.7,
        top_p: 0.9,
      });
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
