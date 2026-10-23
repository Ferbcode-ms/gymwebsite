"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PricingPlan } from "@/lib/cms/types";
import { verifyAdminAuth } from "@/lib/cms/auth";

export async function savePricingAction(plan: PricingPlan) {
  try {
    const auth = await verifyAdminAuth();
    if (!auth.authorized) {
      return { success: false, error: auth.error || "Unauthorized action" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("pricing_plans").upsert([
      {
        id: plan.id,
        title: plan.title,
        description: plan.description,
        monthly_price: plan.monthly_price,
        yearly_price: plan.yearly_price,
        period_note: plan.period_note || "",
        features: plan.features,
        plan_type: plan.plan_type,
        order_index: plan.order_index || 1,
      },
    ]);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to update pricing plan in Supabase",
    };
  }
}
