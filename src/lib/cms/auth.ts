import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Verify whether the incoming server action or API call is from an authorized admin.
 * Checks both Supabase Auth user session and the demo session cookie.
 */
export async function verifyAdminAuth(): Promise<{ authorized: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();

    // 1. Check demo session cookie
    if (cookieStore.get("admin_demo_session")?.value === "true") {
      return { authorized: true };
    }

    // 2. Check Supabase authenticated user
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user && !error) {
        return { authorized: true };
      }
    }

    return {
      authorized: false,
      error: "Unauthorized: admin login session is required.",
    };
  } catch (err: any) {
    return {
      authorized: false,
      error: err.message || "Failed to verify administrator authentication.",
    };
  }
}
