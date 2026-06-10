export function isTruthyEnvValue(value: string | undefined): boolean {
  if (!value) return false;

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export function isRetryableAiStatus(status: number): boolean {
  return status === 429 || status === 503 || status === 504;
}