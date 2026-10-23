"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please provide both email and password" };
  }

  // 1. If Supabase URL and Key are configured, authenticate via Supabase Auth
  const hasSupabaseConfig =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasSupabaseConfig) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      redirect("/admin");
    } catch (err: any) {
      if (err?.digest?.includes("NEXT_REDIRECT")) throw err;
      return { error: err.message || "Failed to authenticate with Supabase" };
    }
  } else {
    // 2. Demo fallback authentication if Supabase keys are not set up yet
    if (
      (email === "admin@apexfitness.com" || email === "admin@apex.com") &&
      password === "admin123"
    ) {
      const cookieStore = await cookies();
      cookieStore.set("admin_demo_session", "true", {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      redirect("/admin");
    }

    return {
      error:
        "Invalid credentials. Use admin@apexfitness.com / admin123 or sign in with your Supabase auth credentials.",
    };
  }
}

export async function logoutAction() {
  const hasSupabaseConfig =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasSupabaseConfig) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signout notice:", e);
    }
  }

  const cookieStore = await cookies();
  cookieStore.delete("admin_demo_session");
  redirect("/admin/login");
}
