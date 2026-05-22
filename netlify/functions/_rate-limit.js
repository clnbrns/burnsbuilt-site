/**
 * BurnsBuilt — Per-IP Rate Limiter (shared)
 * ==================================================================
 * Lightweight rolling-window rate limit backed by Netlify Blobs.
 * Drop into the top of any public function to prevent spam/abuse.
 *
 * Usage:
 *   import { rateLimit, rateLimitResponse } from "./_rate-limit.js";
 *
 *   export const handler = async (event) => {
 *     const rl = await rateLimit(event, { key: "contact", limit: 5, windowSec: 60 });
 *     if (!rl.ok) return rateLimitResponse(rl);
 *     // ... rest of handler
 *   };
 *
 * Defaults: 10 requests per 60 seconds per IP per key.
 *
 * The "key" prefix lets different functions have independent counters
 * even when called from the same IP (so a coach hitting msm-ask doesn't
 * burn the contact form's quota, etc).
 *
 * Fails open — if the blob store can't be reached, the request is
 * allowed through. Better to serve a few extra requests than to brick
 * the site if Netlify Blobs has a hiccup.
 * ==================================================================
 */

import { getStore } from "@netlify/blobs";

const STORE_NAME = "rate-limits";
const SITE_ID_FALLBACK = "21231ebf-f00f-466d-a7f7-47311646da0a";

function getRateStore() {
  try {
    return getStore(STORE_NAME);
  } catch (err) {
    const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || SITE_ID_FALLBACK;
    const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_BLOBS_TOKEN;
    if (!token) return null;
    return getStore({ name: STORE_NAME, siteID, token });
  }
}

function getClientIp(event) {
  // Netlify-provided header is the most reliable
  const direct = event.headers?.["x-nf-client-connection-ip"];
  if (direct) return direct;
  // Fall back to X-Forwarded-For (first IP)
  const xff = event.headers?.["x-forwarded-for"];
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

/**
 * @param {object} event - Netlify function event
 * @param {object} opts - { key: string, limit?: number, windowSec?: number }
 * @returns {Promise<{ok: boolean, remaining: number, retryAfter: number, ip: string}>}
 */
export async function rateLimit(event, { key, limit = 10, windowSec = 60 }) {
  const ip = getClientIp(event);
  const blobKey = `${key}:${ip}`;
  const now = Date.now();

  let store;
  try {
    store = getRateStore();
    if (!store) {
      // No blob access — fail open (allow request) but log
      console.warn(`[rate-limit] blob store unavailable; allowing request for ${blobKey}`);
      return { ok: true, remaining: limit - 1, retryAfter: 0, ip };
    }
  } catch (err) {
    console.warn(`[rate-limit] getStore failed: ${err.message}`);
    return { ok: true, remaining: limit - 1, retryAfter: 0, ip };
  }

  try {
    let bucket = await store.get(blobKey, { type: "json" });
    if (!bucket || now > bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowSec * 1000 };
    }
    bucket.count += 1;
    await store.setJSON(blobKey, bucket);

    const remaining = Math.max(0, limit - bucket.count);
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);

    if (bucket.count > limit) {
      return { ok: false, remaining: 0, retryAfter, ip };
    }
    return { ok: true, remaining, retryAfter, ip };
  } catch (err) {
    // Blob read/write failed — fail open
    console.warn(`[rate-limit] read/write failed: ${err.message}`);
    return { ok: true, remaining: limit - 1, retryAfter: 0, ip };
  }
}

/**
 * Standard 429 response with Retry-After header.
 */
export function rateLimitResponse(rl) {
  return {
    statusCode: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(rl.retryAfter || 60),
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({
      error: "Rate limit exceeded. Please slow down and try again shortly.",
      retryAfter: rl.retryAfter,
    }),
  };
}
