import { describe, expect, it } from 'vitest';
import { isRetryableAiStatus, isTruthyEnvValue } from '@/lib/ai-config';

describe('AI config helpers', () => {
  it('detects truthy env values', () => {
    expect(isTruthyEnvValue('1')).toBe(true);
    expect(isTruthyEnvValue('true')).toBe(true);
    expect(isTruthyEnvValue('yes')).toBe(true);
    expect(isTruthyEnvValue('on')).toBe(true);
    expect(isTruthyEnvValue('0')).toBe(false);
    expect(isTruthyEnvValue(undefined)).toBe(false);
  });

  it('detects retryable ai status codes', () => {
    expect(isRetryableAiStatus(429)).toBe(true);
    expect(isRetryableAiStatus(503)).toBe(true);
    expect(isRetryableAiStatus(504)).toBe(true);
    expect(isRetryableAiStatus(500)).toBe(false);
  });
});