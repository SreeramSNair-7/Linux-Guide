// file: src/lib/huggingface-client.ts

import https from 'node:https';

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY || process.env.HF_API_KEY;
const HF_MODEL = process.env.HF_MODEL || 'HuggingFaceH4/zephyr-7b-beta';
const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';
const REQUEST_TIMEOUT_MS = 60000;
const ALLOW_INSECURE_TLS =
  process.env.HF_ALLOW_INSECURE_TLS === 'true' ||
  process.env.HUGGING_FACE_INSECURE_TLS === '1' ||
  process.env.NODE_ENV !== 'production';

export const HF_CONFIG = {
  apiKey: HF_API_KEY,
  model: HF_MODEL,
  enabled: !!HF_API_KEY,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type ResponseLike = {
  ok: boolean;
  status: number;
  json: () => Promise<any>;
  text: () => Promise<string>;
};

async function postToHuggingFace(body: unknown): Promise<ResponseLike> {
  const payload = JSON.stringify(body);

  return await new Promise((resolve, reject) => {
    const url = new URL(HF_API_URL);
    const request = https.request(
      {
        method: 'POST',
        hostname: url.hostname,
        path: url.pathname,
        port: url.port || 443,
        rejectUnauthorized: ALLOW_INSECURE_TLS ? false : undefined,
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (response) => {
        const chunks: Buffer[] = [];

        response.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        response.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          resolve({
            ok: response.statusCode ? response.statusCode >= 200 && response.statusCode < 300 : false,
            status: response.statusCode ?? 0,
            json: async () => JSON.parse(text),
            text: async () => text,
          });
        });
      }
    );

    request.setTimeout(REQUEST_TIMEOUT_MS, () => {
      request.destroy(new Error('Request timed out'));
    });

    request.on('error', reject);
    request.write(payload);
    request.end();
  });
}

async function readErrorMessage(response: ResponseLike): Promise<string> {
  try {
    const text = await response.text();
    if (!text) return 'Unknown error';
    
    try {
      const data = JSON.parse(text);
      if (data?.error) return data.error;
      return typeof data === 'string' ? data : JSON.stringify(data);
    } catch {
      return text;
    }
  } catch {
    return 'Unknown error';
  }
}

/**
 * Check if Hugging Face API is available
 */
export async function checkHuggingFaceHealth(): Promise<{
  enabled: boolean;
  configured: boolean;
  error?: string;
}> {
  if (!HF_API_KEY) {
    return {
      enabled: false,
      configured: false,
      error: 'HUGGING_FACE_API_KEY or HF_API_KEY environment variable not set',
    };
  }

  try {
    // Try a simple request to verify the API key works
    const makeRequest = () =>
      postToHuggingFace({
        model: HF_MODEL,
        messages: [{ role: 'user', content: 'ping' }],
        stream: false,
      });

    let response = await makeRequest();
    if (!response.ok && [429, 503, 504].includes(response.status)) {
      await sleep(1500);
      response = await makeRequest();
    }

    if (!response.ok) {
      const errorMessage = await readErrorMessage(response);
      return {
        enabled: true,
        configured: false,
        error: `API error: ${errorMessage || response.status}`,
      };
    }

    return {
      enabled: true,
      configured: true,
    };
  } catch (error) {
    return {
      enabled: true,
      configured: false,
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

    const makeRequest = () =>
      postToHuggingFace({
        model: HF_MODEL,
        messages: [{ role: 'user', content: fullPrompt }],
        stream: false,
      });

    let response = await makeRequest();
    if (!response.ok && [429, 503, 504].includes(response.status)) {
      await sleep(1500);
      response = await makeRequest();
    }

    if (!response.ok) {
      const errorMessage = await readErrorMessage(response);
      throw new Error(errorMessage || `HTTP ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data?.choices) && data.choices.length > 0) {
      return data.choices[0]?.message?.content || '';
    }

    if (data?.message?.content) {
      return data.message.content;
    }

    if (typeof data === 'string') {
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
