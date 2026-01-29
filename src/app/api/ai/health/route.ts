// file: src/app/api/ai/health/route.ts
import { NextResponse } from 'next/server';
import { checkOllamaHealth, listModels, OLLAMA_CONFIG } from '@/lib/ollama-client';
import { checkHuggingFaceHealth, HF_CONFIG } from '@/lib/huggingface-client';

export async function GET() {
  try {
    // Check both providers
    const ollamaHealth = await checkOllamaHealth();
    const hfHealth = await checkHuggingFaceHealth();
    const models = await listModels();

    // System is healthy if either provider is available
    const isHealthy =
      (ollamaHealth.running && ollamaHealth.modelAvailable) ||
      HF_CONFIG.enabled;

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      providers: {
        huggingface: {
          enabled: hfHealth.enabled,
          configured: hfHealth.configured,
          model: HF_CONFIG.model,
          error: hfHealth.error,
        },
        ollama: {
          running: ollamaHealth.running,
          baseUrl: OLLAMA_CONFIG.baseUrl,
          model: OLLAMA_CONFIG.model,
          modelAvailable: ollamaHealth.modelAvailable,
          error: ollamaHealth.error,
        },
      },
      availableModels: models,
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
