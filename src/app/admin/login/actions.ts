"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  recordFailedLogin,
  resetRateLimit,
} from "@/lib/cms/auth";

async function getClientIp(): Promise<string> {
  try {
    const headerStore = await headers();
    const forwarded = headerStore.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
    return (
      headerStore.get("cf-connecting-ip") ||
      headerStore.get("x-real-ip") ||
      "127.0.0.1"
    );
  } catch {
    return "127.0.0.1";
  }
}

export async function loginAction(formData: FormData) {
  const clientIp = await getClientIp();

  // 1. Enforce rate limiting per client IP to prevent brute-force attacks
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return {
      error: `Too many failed attempts. Account locked for security. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
    };
  }

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please provide both email and password" };
  }

  // 2. Validate Supabase environment configuration
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      error: "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing in Cloudflare settings.",
    };
  }

  // 3. Authenticate purely via Supabase Auth
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const attemptResult = recordFailedLogin(clientIp);
      if (attemptResult.locked) {
        return {
          error: "Maximum failed attempts reached. Access temporarily locked for 15 minutes.",
        };
      }
      return {
        error: `${error.message} (${attemptResult.remainingAttempts} attempts remaining)`,
      };
    }

    // Success: reset rate limit counter and redirect to admin
    resetRateLimit(clientIp);
    redirect("/admin");
  } catch (err: any) {
    if (err?.digest?.includes("NEXT_REDIRECT")) throw err;
    return { error: err.message || "Failed to authenticate with Supabase Auth" };
  }
}

export async function logoutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore sign-out network errors
  }

  redirect("/admin/login");
}
