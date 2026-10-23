"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SiteContent } from "@/lib/cms/types";
import { verifyAdminAuth } from "@/lib/cms/auth";

export async function saveContentAction(sectionKey: keyof SiteContent, data: any) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.authorized) {
      return { success: false, error: auth.error || "Unauthorized action" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("site_content").upsert([
      {
        section: sectionKey,
        data,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to update content in Supabase",
    };
  }
}
