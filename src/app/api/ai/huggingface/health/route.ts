// file: src/app/api/ai/huggingface/health/route.ts
import { NextResponse } from 'next/server';
import { checkHuggingFaceHealth, HF_CONFIG } from '@/lib/huggingface-client';

export async function GET() {
  try {
    const health = await checkHuggingFaceHealth();

    return NextResponse.json({
      service: 'huggingface',
      enabled: HF_CONFIG.enabled,
      available: health.available,
      model: HF_CONFIG.model,
      error: health.error,
    });
  } catch (error) {
    return NextResponse.json(
      {
        service: 'huggingface',
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
