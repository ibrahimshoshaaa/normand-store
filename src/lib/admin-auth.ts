// Normand — admin gate helpers (pure, no Next.js imports).
// Runs in both the Node server actions and the Edge middleware, so it only
// uses Web Crypto (globalThis.crypto.subtle), available in both runtimes.
//
// The admin cookie is an HMAC-SHA256 of a fixed value, keyed by the
// ADMIN_PASSWORD env var. It cannot be forged without knowing the password,
// and it carries no session state on the server.

export const ADMIN_COOKIE = "normand-admin";
const ADMIN_SESSION_VALUE = "normand-admin-v1";

function toHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacHex(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(sig);
}

export async function signAdminCookie(secret: string): Promise<string> {
  return `v1.${await hmacHex(secret, ADMIN_SESSION_VALUE)}`;
}

/** Constant-time-ish comparison: no early exit on the first mismatch. */
function slowEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyAdminCookie(
  value: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!value) return false;
  const expected = await signAdminCookie(secret);
  return slowEqual(value, expected);
}

export function isAdminPasswordSet(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}
