export const getRandomDelayMs = (baseMs: number, jitterMs: number = 200) =>
  baseMs + Math.floor(Math.random() + jitterMs);
