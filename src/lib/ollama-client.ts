// file: src/lib/ollama-client.ts
import { Ollama } from 'ollama';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral-small-3';

// Initialize Ollama client
export const ollama = new Ollama({ host: OLLAMA_BASE_URL });

export const OLLAMA_CONFIG = {
  baseUrl: OLLAMA_BASE_URL,
  model: OLLAMA_MODEL,
};

/**
 * Check if Ollama is running and the model is available
 */
export async function checkOllamaHealth(): Promise<{
  running: boolean;
  modelAvailable: boolean;
  error?: string;
}> {
  try {
    // Check if Ollama is running
    const models = await ollama.list();
    const modelAvailable = models.models.some((m) => m.name.includes(OLLAMA_MODEL));

    return {
      running: true,
      modelAvailable,
      error: modelAvailable ? undefined : `Model ${OLLAMA_MODEL} not found. Run: ollama pull ${OLLAMA_MODEL}`,
    };
  } catch (error) {
    return {
      running: false,
      modelAvailable: false,
      error: 'Ollama is not running. Start it with: ollama serve',
    };
  }
}

/**
 * Generate a response from Ollama with the given prompt
 */
export async function generateResponse(
  prompt: string,
  systemPrompt: string,
  options?: {
    temperature?: number;
    top_p?: number;
    stream?: boolean;
  }
): Promise<string> {
  const response = await ollama.generate({
    model: OLLAMA_MODEL,
    prompt: `${systemPrompt}\n\n${prompt}`,
    stream: options?.stream || false,
    options: {
      temperature: options?.temperature || 0.7,
      top_p: options?.top_p || 0.9,
    },
  });

  return response.response;
}

/**
 * Chat with Ollama (maintains conversation context)
 */
export async function chatWithOllama(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options?: {
    temperature?: number;
    stream?: boolean;
  }
) {
  const response = await ollama.chat({
    model: OLLAMA_MODEL,
    messages,
    stream: options?.stream || false,
    options: {
      temperature: options?.temperature || 0.7,
    },
  });

  return response.message.content;
}

/**
 * List available Ollama models
 */
export async function listModels() {
  try {
    const models = await ollama.list();
    return models.models.map((m) => ({
      name: m.name,
      size: m.size,
      modified: m.modified_at,
    }));
  } catch (error) {
    console.error('Failed to list models:', error);
    return [];
  }
}
