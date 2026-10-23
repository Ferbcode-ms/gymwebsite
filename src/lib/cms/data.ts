import { ServiceItem, PricingPlan, SiteContent, LeadItem } from "./types";
import { DEFAULT_SERVICES, DEFAULT_PRICING, DEFAULT_CONTENT } from "./defaults";
import { getPublicSupabase } from "../supabase/public";
import { createClient } from "../supabase/server";

export { DEFAULT_SERVICES, DEFAULT_PRICING, DEFAULT_CONTENT };

function sanitizeImageUrl(image: string, fallbackId?: string): string {
  if (!image || image.includes("cdn.prod.website-files.com") || image.includes("skulpt")) {
    if (fallbackId === "fitness" || image?.includes("fitness")) {
      return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
    }
    if (fallbackId === "personal-training" || image?.includes("personal-training")) {
      return "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80";
    }
    if (fallbackId === "group-classes" || image?.includes("groepslessen") || image?.includes("hardlopen")) {
      return "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80";
    }
    if (fallbackId === "hyrox" || image?.includes("hyrox")) {
      return "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80";
    }
    if (fallbackId === "coaches" || image?.includes("coach")) {
      return "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80";
    }
    if (fallbackId === "equipment" || image?.includes("equipment") || image?.includes("apparatuur")) {
      return "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80";
    }
    if (fallbackId === "coffee" || image?.includes("coffee") || image?.includes("koffie")) {
      return "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80";
    }
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
  }
  return image;
}

/**
 * Fetch all public services from Supabase or return defaults.
 * Uses lightweight public client without cookies for maximum cacheability.
 */
export async function getServices(): Promise<ServiceItem[]> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return DEFAULT_SERVICES;

    const { data, error } = await supabase
      .from("services")
      .select("id, num, title, category, description, image, order_index")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_SERVICES;
    }

    const services = data as ServiceItem[];
    return services.map((s) => ({
      ...s,
      image: sanitizeImageUrl(s.image, s.id),
    }));
  } catch {
    return DEFAULT_SERVICES;
  }
}

/**
 * Fetch public pricing plans from Supabase or return defaults.
 * Uses lightweight public client without cookies for maximum cacheability.
 */
export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return DEFAULT_PRICING;

    const { data, error } = await supabase
      .from("pricing_plans")
      .select("id, title, description, monthly_price, yearly_price, period_note, features, plan_type, order_index")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_PRICING;
    }

    return data as PricingPlan[];
  } catch {
    return DEFAULT_PRICING;
  }
}

/**
 * Fetch public site content from Supabase or return defaults.
 * Uses lightweight public client without cookies for maximum cacheability.
 */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return DEFAULT_CONTENT;

    const { data, error } = await supabase
      .from("site_content")
      .select("section, data");

    const rows = (data || []) as Array<{ section: string; data: any }>;
    if (error || rows.length === 0) {
      return DEFAULT_CONTENT;
    }

    // Merge stored sections with defaults
    const content = { ...DEFAULT_CONTENT };
    rows.forEach((row) => {
      if (row.section && row.data) {
        if (Array.isArray(row.data)) {
          (content as any)[row.section] = row.data;
        } else {
          (content as any)[row.section] = {
            ...(content as any)[row.section],
            ...row.data,
          };
        }
      }
    });

    // Sanitize any legacy image URLs and branding
    if (Array.isArray(content.feature_cards)) {
      content.feature_cards = content.feature_cards.map((c) => ({
        ...c,
        image: sanitizeImageUrl(c.image, c.id),
      }));
    }

    if (content.about) {
      if (content.about.headline === "Skulpt Fitness") {
        content.about.headline = "Apex Fitness";
      }
      if (content.about.paragraph1 && content.about.paragraph1.includes("Skulpt Fitness")) {
        content.about.paragraph1 = content.about.paragraph1.replace(/Skulpt Fitness/g, "Apex Fitness");
      }
    }

    if (content.hero && content.hero.subheadline && content.hero.subheadline.includes("Skulpt Fitness")) {
      content.hero.subheadline = DEFAULT_CONTENT.hero.subheadline;
    }

    return content;
  } catch {
    return DEFAULT_CONTENT;
  }
}

/**
 * Fetch customer leads from Supabase.
 * Admin-only: Uses authenticated server client with session cookies.
 */
export async function getLeads(): Promise<LeadItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leads")
      .select("id, created_at, name, phone, email, message, status")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}
