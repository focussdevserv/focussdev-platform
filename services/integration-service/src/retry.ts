export function retryDelayMs(attempt: number, random = Math.random): number {
  const normalizedAttempt = Math.max(1, Math.floor(attempt));
  const ceiling = Math.min(15 * 60_000, 1_000 * 2 ** (normalizedAttempt - 1));
  return Math.floor(ceiling / 2 + random() * (ceiling / 2));
}
