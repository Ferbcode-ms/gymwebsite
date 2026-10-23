"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ServiceItem } from "@/lib/cms/types";
import { verifyAdminAuth } from "@/lib/cms/auth";

export async function saveServiceAction(service: ServiceItem) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.authorized) {
      return { success: false, error: auth.error || "Unauthorized action" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("services").upsert([
      {
        id: service.id,
        num: service.num,
        title: service.title,
        category: service.category,
        description: service.description,
        image: service.image,
        order_index: service.order_index || 1,
      },
    ]);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to update service in Supabase",
    };
  }
}
