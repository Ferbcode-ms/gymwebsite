import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  recordFailedLogin,
  resetRateLimit,
  verifyAdminAuth,
} from "@/lib/cms/auth";

describe("Admin Supabase Authentication & Brute-Force Rate Limiting", () => {
  const TEST_IP = "192.168.1.100";

  beforeEach(() => {
    resetRateLimit(TEST_IP);
  });

  describe("Rate Limiting & Lockout Protection", () => {
    it("allows initial requests without restriction", () => {
      const status = checkRateLimit(TEST_IP);
      expect(status.allowed).toBe(true);
    });

    it("tracks failed attempts and locks out after 5 consecutive failures", () => {
      for (let i = 1; i <= 4; i++) {
        const attempt = recordFailedLogin(TEST_IP);
        expect(attempt.locked).toBe(false);
        expect(attempt.remainingAttempts).toBe(5 - i);
      }

      // 5th failed attempt must trigger lockout
      const fifthAttempt = recordFailedLogin(TEST_IP);
      expect(fifthAttempt.locked).toBe(true);
      expect(fifthAttempt.remainingAttempts).toBe(0);

      // Subsequent checks should report locked
      const check = checkRateLimit(TEST_IP);
      expect(check.allowed).toBe(false);
      expect(check.retryAfterSeconds).toBeGreaterThan(0);
    });

    it("resets rate limit on successful authentication", () => {
      recordFailedLogin(TEST_IP);
      recordFailedLogin(TEST_IP);
      resetRateLimit(TEST_IP);

      const status = checkRateLimit(TEST_IP);
      expect(status.allowed).toBe(true);
    });
  });

  describe("verifyAdminAuth Protection", () => {
    it("rejects unauthorized access when no valid Supabase user session exists", async () => {
      const auth = await verifyAdminAuth();
      expect(auth.authorized).toBe(false);
      expect(auth.error).toBeDefined();
    });
  });
});
