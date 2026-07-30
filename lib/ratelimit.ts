/**
 * In-memory sliding-window rate limiter.
 *
 * NOTE: single-instance only — the window state lives in this process, so
 * limits are per-server-instance and reset on deploy/restart. Acceptable for
 * the current single-dyno Render deployment. Upgrade path: move the window
 * store to Redis (e.g. Upstash) or a Postgres-backed counter when running
 * multiple instances.
 */

interface WindowEntry {
  hits: number[];
}

const windows = new Map<string, WindowEntry>();
let lastSweep = Date.now();

/** Prune expired entries so the map does not grow unboundedly. */
function sweep(maxWindowMs: number) {
  const now = Date.now();
  if (now - lastSweep < maxWindowMs) return;
  lastSweep = now;
  const staleKeys: string[] = [];
  windows.forEach((entry, key) => {
    entry.hits = entry.hits.filter((t) => now - t < maxWindowMs);
    if (entry.hits.length === 0) staleKeys.push(key);
  });
  for (const key of staleKeys) windows.delete(key);
}

/**
 * Record an attempt for `key` and return true if it is WITHIN the limit
 * (i.e. allowed), false if the limit has been exceeded.
 *
 * @param key       Unique bucket key (e.g. `stkpush:ip:1.2.3.4`)
 * @param limit     Max allowed attempts inside the window
 * @param windowMs  Sliding window length in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(windowMs);

  let entry = windows.get(key);
  if (!entry) {
    entry = { hits: [] };
    windows.set(key, entry);
  }
  entry.hits = entry.hits.filter((t) => now - t < windowMs);
  if (entry.hits.length >= limit) {
    return false;
  }
  entry.hits.push(now);
  return true;
}
