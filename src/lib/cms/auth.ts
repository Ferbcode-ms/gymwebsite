import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

interface RateLimitRecord {
  count: number;
  lockedUntil?: number;
}

// In-memory rate limiting map for login attempts per IP/identifier
const loginRateLimit = new Map<string, RateLimitRecord>();

/**
 * Checks rate limiting for a client identifier (prevents brute-force attempts).
 */
export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterSeconds?: number } {
  const record = loginRateLimit.get(identifier);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil && now < record.lockedUntil) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  if (record.lockedUntil && now >= record.lockedUntil) {
    loginRateLimit.delete(identifier);
    return { allowed: true };
  }

  return { allowed: true };
}

/**
 * Records a failed login attempt and applies temporary lockout if threshold exceeded.
 */
export function recordFailedLogin(identifier: string): { locked: boolean; remainingAttempts: number } {
  const now = Date.now();
  const record = loginRateLimit.get(identifier) || { count: 0 };
  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    loginRateLimit.set(identifier, record);
    return { locked: true, remainingAttempts: 0 };
  }

  loginRateLimit.set(identifier, record);
  return { locked: false, remainingAttempts: MAX_ATTEMPTS - record.count };
}

/**
 * Resets rate limit counters after successful login.
 */
export function resetRateLimit(identifier: string): void {
  loginRateLimit.delete(identifier);
}

/**
 * Centralized administrator authorization verification.
 * Strictly uses Supabase Auth session via JWT cookies (@supabase/ssr).
 */
export async function verifyAdminAuth(): Promise<{ authorized: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user && !error) {
      return { authorized: true };
    }

    return {
      authorized: false,
      error: "Unauthorized: administrator session required.",
    };
  } catch (err: any) {
    return {
      authorized: false,
      error: err?.message || "Failed to verify administrator authentication.",
    };
  }
}
