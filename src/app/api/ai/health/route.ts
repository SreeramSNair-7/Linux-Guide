// file: src/app/api/ai/health/route.ts
import { NextResponse } from 'next/server';
import { checkOllamaHealth, listModels, OLLAMA_CONFIG } from '@/lib/ollama-client';

export async function GET() {
  try {
    const health = await checkOllamaHealth();
    const models = await listModels();

    return NextResponse.json({
      status: health.running && health.modelAvailable ? 'healthy' : 'unhealthy',
      ollama: {
        running: health.running,
        baseUrl: OLLAMA_CONFIG.baseUrl,
        model: OLLAMA_CONFIG.model,
        modelAvailable: health.modelAvailable,
      },
      availableModels: models,
      error: health.error,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
