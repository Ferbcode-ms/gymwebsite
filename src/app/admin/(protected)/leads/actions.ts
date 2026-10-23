"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyAdminAuth } from "@/lib/cms/auth";

export async function updateLeadStatus(id: string, status: "new" | "contacted" | "archived") {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.authorized) {
      return { success: false, error: auth.error || "Unauthorized action" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update lead" };
  }
}

export async function deleteLead(id: string) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.authorized) {
      return { success: false, error: auth.error || "Unauthorized action" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete lead" };
  }
}
