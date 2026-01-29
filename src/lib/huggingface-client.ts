// file: src/lib/huggingface-client.ts

import https from 'https';

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY || process.env.HF_API_KEY;
const HF_MODEL = process.env.HF_MODEL || 'HuggingFaceH4/zephyr-7b-beta';
const HF_API_URL = 'https://router.huggingface.co/models';
const HF_INSECURE_TLS =
  process.env.HUGGING_FACE_INSECURE_TLS === '1' && process.env.NODE_ENV !== 'production';
const REQUEST_TIMEOUT_MS = 20000;

if (HF_INSECURE_TLS) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

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
  try {
    const response = await fetch(`${HF_API_URL}/${HF_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response;
  } catch (error) {
    return postToHuggingFaceHttps(body, error);
  }
}

async function postToHuggingFaceHttps(body: unknown, originalError: unknown): Promise<ResponseLike> {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(`${HF_API_URL}/${HF_MODEL}`);
      const agent = new https.Agent({ rejectUnauthorized: !HF_INSECURE_TLS });
      const payload = JSON.stringify(body);

      const request = https.request(
        {
          method: 'POST',
          hostname: url.hostname,
          path: url.pathname,
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
          agent,
          timeout: REQUEST_TIMEOUT_MS,
        },
        (response) => {
          const chunks: Buffer[] = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => {
            const text = Buffer.concat(chunks).toString('utf8');
            const status = response.statusCode || 500;
            resolve({
              ok: status >= 200 && status < 300,
              status,
              json: async () => {
                try {
                  return JSON.parse(text);
                } catch {
                  return { error: text || 'Invalid JSON response' };
                }
              },
              text: async () => text,
            });
          });
        }
      );

      request.on('error', (err) => reject(err));
      request.on('timeout', () => {
        request.destroy(new Error('Hugging Face request timed out'));
      });

      request.write(payload);
      request.end();
    } catch (err) {
      const originalMessage = originalError instanceof Error ? originalError.message : 'fetch failed';
      const message = err instanceof Error ? err.message : 'https request failed';
      reject(new Error(`${originalMessage}; https fallback failed: ${message}`));
    }
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
        inputs: 'ping',
        parameters: {
          max_new_tokens: 10,
        },
        options: {
          wait_for_model: true,
          use_cache: true,
        },
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
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: options?.maxTokens || 512,
          temperature: options?.temperature || 0.7,
          do_sample: true,
        },
        options: {
          wait_for_model: true,
          use_cache: true,
        },
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
