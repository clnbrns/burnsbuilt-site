/**
 * BurnsBuilt — Exposure Events API Proxy
 * ==================================================================
 * Signed proxy that lets the browser fetch tournament data (schedule,
 * standings, teams, divisions) from Exposure Events.
 *
 * Why this exists: Exposure's API uses HMAC-SHA256 signing with a
 * secret key. That can't run in the browser without leaking the
 * secret. This Netlify Function signs the request server-side and
 * forwards it.
 *
 * Endpoints discovered via the spike (all on baseball.exposureevents.com):
 *   GET /api/v1/events                          → list events (sport-scoped)
 *   GET /api/v1/events/{id}                     → single event
 *   GET /api/v1/games?eventid={id}              → games for an event
 *   GET /api/v1/standings?eventid={id}          → standings
 *   GET /api/v1/divisions?eventid={id}          → divisions
 *   GET /api/v1/teams?eventid={id}              → teams
 *
 * Caching: in-process memory cache, 30s TTL by default.
 *
 * QUERY STRING API:
 *   GET /.netlify/functions/exposure-proxy?path=<basePath>&<...upstreamQuery>
 *
 *   The first query param `path` is required and tells us the upstream
 *   path. All OTHER query params are forwarded to upstream verbatim.
 *
 *   Examples:
 *     ?path=/api/v1/events
 *     ?path=/api/v1/events/268807
 *     ?path=/api/v1/games&eventid=268807
 *     ?path=/api/v1/standings&eventid=268807
 *
 *   Only path values starting with /api/v1/ are allowed.
 *
 * Required env vars:
 *   EXPOSURE_API_KEY     — from Exposure director dashboard
 *   EXPOSURE_SECRET_KEY  — from Exposure director dashboard
 *
 * Optional env vars:
 *   EXPOSURE_HOST              — defaults to "baseball.exposureevents.com"
 *   EXPOSURE_CACHE_TTL_MS      — defaults to 30000 (30s)
 * ==================================================================
 */

import crypto from "node:crypto";

const DEFAULT_HOST = "baseball.exposureevents.com";
const ALLOWED_PATH_PREFIX = "/api/v1/";

const HOST = process.env.EXPOSURE_HOST || DEFAULT_HOST;
const BASE_URL = `https://${HOST}`;
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
    "Access-Control-Allow-Origin": "*",
    ...extraHeaders,
  },
  body: typeof body === "string" ? body : JSON.stringify(body),
});

const isoTimestamp = () => {
  // Exposure example: 2012-09-27T20:33:55.3564453Z
  const iso = new Date().toISOString().replace("Z", "");
  return iso + "0000Z";
};

const sign = (apiKey, secretKey, method, pathOnly, timestamp) => {
  // String-to-sign uses the PATH ONLY (not the query string), uppercased.
  const stringToSign = `${apiKey}&${method}&${timestamp}&${pathOnly}`.toUpperCase();
  return crypto
    .createHmac("sha256", secretKey)
    .update(stringToSign, "utf8")
    .digest("base64");
};

// ---- Handler -------------------------------------------------------
export const handler = async (event) => {
  // CORS preflight (for /board/ etc. on different hosts)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

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

  // ---- Build upstream URL ----
  const params = event.queryStringParameters || {};
  const path = params.path;
  if (!path) {
    return json(400, {
      error: "Missing ?path= query parameter. Example: ?path=/api/v1/games&eventid=268807",
    });
  }
  if (!path.startsWith(ALLOWED_PATH_PREFIX)) {
    return json(400, { error: `path must start with ${ALLOWED_PATH_PREFIX}` });
  }
  if (path.includes("://") || path.includes("\n") || path.includes("..") || path.includes("?")) {
    return json(400, { error: "Invalid path — must be a plain path, no scheme/query" });
  }

  // Forward all other query params to upstream
  const upstreamQuery = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k === "path") continue;
    upstreamQuery.append(k, v);
  }
  const queryString = upstreamQuery.toString();
  const upstreamUrl = `${BASE_URL}${path}${queryString ? "?" + queryString : ""}`;

  // ---- Cache check ----
  const cacheKey = "GET " + path + "?" + queryString;
  const cached = getCached(cacheKey);
  if (cached) {
    return json(200, cached, { "X-Proxy-Cache": "HIT" });
  }

  // ---- Sign + forward ----
  const timestamp = isoTimestamp();
  const signature = sign(apiKey, secretKey, "GET", path, timestamp);  // path only, no query
  const authToken = `${apiKey}.${signature}`;

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        // Exposure uses a custom "Authentication" header — not standard Authorization.
        // Confirmed via their official PHP wrapper (line 183).
        Authentication: authToken,
        Timestamp: timestamp,
        Accept: "application/json",
        "Content-Type": "application/json",
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
    parsed = { _raw: text.slice(0, 500) };
  }

  if (!upstream.ok) {
    return json(upstream.status, {
      error: "Upstream returned non-2xx",
      status: upstream.status,
      upstream: parsed,
    }, { "X-Proxy-Cache": "MISS" });
  }

  setCached(cacheKey, parsed);
  return json(200, parsed, { "X-Proxy-Cache": "MISS" });
};
