const hits = new Map<string, number[]>();

/**
 * Simple in-memory sliding-window rate limiter.
 *
 * @param key      Unique identifier (e.g. IP + route)
 * @param limit    Max requests allowed inside the window
 * @param windowMs Window size in milliseconds
 * @returns `true` if the request is allowed, `false` if rate-limited
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const timestamps = hits.get(key) ?? [];

    // Remove entries outside the current window
    const valid = timestamps.filter((t) => now - t < windowMs);

    if (valid.length >= limit) {
        hits.set(key, valid);
        return false;
    }

    valid.push(now);
    hits.set(key, valid);
    return true;
}
