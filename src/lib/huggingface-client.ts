// file: src/lib/huggingface-client.ts

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY || process.env.HF_API_KEY;
const HF_MODEL = process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.1';
const HF_API_URL = 'https://api-inference.huggingface.co/models';

export const HF_CONFIG = {
  apiKey: HF_API_KEY,
  model: HF_MODEL,
  enabled: !!HF_API_KEY,
};

/**
 * Check if Hugging Face API is available
 */
export async function checkHuggingFaceHealth(): Promise<{
  available: boolean;
  error?: string;
}> {
  if (!HF_API_KEY) {
    return {
      available: false,
      error: 'HUGGING_FACE_API_KEY or HF_API_KEY environment variable not set',
    };
  }

  try {
    // Try a simple request to verify the API key works
    const response = await fetch(`${HF_API_URL}/${HF_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: 'ping',
        parameters: {
          max_new_tokens: 10,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        available: false,
        error: `API error: ${error.error || response.statusText}`,
      };
    }

    return {
      available: true,
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error checking HF health',
    };
  }
}

/**
 * Generate a response from Hugging Face with the given prompt
 */
export async function generateHuggingFaceResponse(
  prompt: string,
  systemPrompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  if (!HF_API_KEY) {
    throw new Error('HUGGING_FACE_API_KEY is not configured');
  }

  try {
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    const response = await fetch(`${HF_API_URL}/${HF_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: options?.maxTokens || 512,
          temperature: options?.temperature || 0.7,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();

    // Handle different response formats from HF
    if (Array.isArray(data) && data.length > 0) {
      return data[0].generated_text || '';
    } else if (data.generated_text) {
      return data.generated_text;
    } else if (typeof data === 'string') {
      return data;
    }

    throw new Error('Unexpected response format from Hugging Face');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Hugging Face API error: ${errorMessage}`);
  }
}

/**
 * Stream a response from Hugging Face (fallback: returns full response)
 * Note: Hugging Face doesn't support streaming in the inference API,
 * so we return the full response at once
 */
export async function* streamHuggingFaceResponse(
  prompt: string,
  systemPrompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): AsyncGenerator<string> {
  try {
    const response = await generateHuggingFaceResponse(prompt, systemPrompt, options);
    yield response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Hugging Face error: ${errorMessage}`);
  }
}
