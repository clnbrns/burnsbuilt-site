/**
 * BurnsBuilt — Exposure Events API Proxy
 * ==================================================================
 * Signed proxy that lets the browser fetch tournament data (schedule,
 * standings, brackets, teams) from Exposure Events.
 *
 * Why this exists: Exposure's API uses HMAC-SHA256 signing with a
 * secret key. That can't run in the browser without leaking the
 * secret. This Netlify Function signs the request server-side and
 * forwards it.
 *
 * Caching: in-process memory cache, 30s TTL by default. 100 viewers
 * hitting the page during a tournament → 1 upstream API call per 30s,
 * fanned out to everyone.
 *
 * ENDPOINT:
 *   GET /.netlify/functions/exposure-proxy?path=/api/v1/events/268807/games
 *   GET /.netlify/functions/exposure-proxy?path=/api/v1/events/268807/standings
 *
 * The `path` query param is the relative URI to forward to Exposure.
 * Anything starting with `/api/v1/` is allowed; everything else is
 * rejected to prevent the proxy from being used as an open relay.
 *
 * Required env vars:
 *   EXPOSURE_API_KEY     — from Exposure director dashboard
 *   EXPOSURE_SECRET_KEY  — from Exposure director dashboard
 *
 * Optional env vars:
 *   EXPOSURE_TIMESTAMP_HEADER  — defaults to "Timestamp". If Exposure
 *                                rejects requests, try "X-Date" or "Date".
 *   EXPOSURE_CACHE_TTL_MS      — defaults to 30000 (30s)
 * ==================================================================
 */

import crypto from "node:crypto";

const HOST = "exposureevents.com";
const BASE_URL = `https://${HOST}`;
const ALLOWED_PATH_PREFIX = "/api/v1/";

const TIMESTAMP_HEADER = process.env.EXPOSURE_TIMESTAMP_HEADER || "Timestamp";
const CACHE_TTL_MS = parseInt(process.env.EXPOSURE_CACHE_TTL_MS || "30000", 10);

// ---- In-process cache (resets on cold start) -----------------------
const cache = new Map();
const getCached = (key) => {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.t > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.data;
};
const setCached = (key, data) => {
  cache.set(key, { t: Date.now(), data });
  // Bound the cache so a long-running container can't leak memory
  if (cache.size > 50) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].t - b[1].t)[0];
    if (oldest) cache.delete(oldest[0]);
  }
};

// ---- Helpers -------------------------------------------------------
const json = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": `public, max-age=${Math.floor(CACHE_TTL_MS / 1000)}`,
    ...extraHeaders,
  },
  body: typeof body === "string" ? body : JSON.stringify(body),
});

const isoTimestamp = () => {
  // Exposure example: 2012-09-27T20:33:55.3564453Z
  const d = new Date();
  const iso = d.toISOString().replace("Z", "");
  // ISO gives milliseconds (3 digits). Pad to 7 digits to match their example.
  return iso + "0000Z";
};

const sign = (apiKey, secretKey, method, path, timestamp) => {
  const stringToSign = `${apiKey}&${method}&${timestamp}&${path}`.toUpperCase();
  return crypto
    .createHmac("sha256", secretKey)
    .update(stringToSign, "utf8")
    .digest("base64");
};

// ---- Handler -------------------------------------------------------
export const handler = async (event) => {
  // ---- Validate env ----
  const apiKey = process.env.EXPOSURE_API_KEY;
  const secretKey = process.env.EXPOSURE_SECRET_KEY;
  if (!apiKey || !secretKey) {
    return json(500, {
      error: "Server is missing EXPOSURE_API_KEY / EXPOSURE_SECRET_KEY env vars",
    });
  }

  if (event.httpMethod !== "GET") {
    return json(405, { error: "GET only" });
  }

  // ---- Validate path ----
  const path = event.queryStringParameters?.path;
  if (!path) {
    return json(400, {
      error: "Missing ?path= query parameter. Example: ?path=/api/v1/events/268807/games",
    });
  }
  if (!path.startsWith(ALLOWED_PATH_PREFIX)) {
    return json(400, {
      error: `path must start with ${ALLOWED_PATH_PREFIX}`,
    });
  }
  // Reject anything looking like a host override or scheme injection
  if (path.includes("://") || path.includes("\n") || path.includes("..")) {
    return json(400, { error: "Invalid path" });
  }

  // ---- Cache check ----
  const cacheKey = "GET " + path;
  const cached = getCached(cacheKey);
  if (cached) {
    return json(200, cached, { "X-Proxy-Cache": "HIT" });
  }

  // ---- Sign + forward ----
  const timestamp = isoTimestamp();
  const signature = sign(apiKey, secretKey, "GET", path, timestamp);
  const authHeader = `${apiKey}.${signature}`;
  const upstreamUrl = `${BASE_URL}${path}`;

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        [TIMESTAMP_HEADER]: timestamp,
        Accept: "application/json",
        "Content-Type": "application/json",
        Host: HOST,
        "User-Agent": "BurnsBuilt-MSM-Proxy/1.0",
      },
    });
  } catch (err) {
    console.error("Upstream fetch error:", err);
    return json(502, { error: "Upstream unreachable", detail: err.message });
  }

  const text = await upstream.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { _raw: text };
  }

  if (!upstream.ok) {
    // Surface the error but don't cache it
    return json(upstream.status, {
      error: "Upstream returned non-2xx",
      status: upstream.status,
      upstream: parsed,
    }, { "X-Proxy-Cache": "MISS" });
  }

  setCached(cacheKey, parsed);
  return json(200, parsed, { "X-Proxy-Cache": "MISS" });
};
