import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  DEFAULT_SERVICES,
  DEFAULT_PRICING,
  DEFAULT_CONTENT,
  getServices,
  getPricingPlans,
  getSiteContent,
} from "@/lib/cms/data";

describe("CMS Data & Fallback Defaults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DEFAULT_SERVICES", () => {
    it("should provide exactly 4 default services", () => {
      expect(DEFAULT_SERVICES).toHaveLength(4);
    });

    it("should have correct properties on every service item", () => {
      DEFAULT_SERVICES.forEach((service) => {
        expect(service).toHaveProperty("id");
        expect(service).toHaveProperty("num");
        expect(service).toHaveProperty("title");
        expect(service).toHaveProperty("category");
        expect(service).toHaveProperty("description");
        expect(service).toHaveProperty("image");
        expect(service.image).toMatch(/^https:\/\//);
        // Ensure no legacy domains exist in defaults
        expect(service.image).not.toContain("cdn.prod.website-files.com");
        expect(service.image).not.toContain("skulptfitness.nl");
      });
    });

    it("should have formatted numbering (01, 02, 03, 04)", () => {
      const numbers = DEFAULT_SERVICES.map((s) => s.num);
      expect(numbers).toEqual(["01", "02", "03", "04"]);
    });
  });

  describe("DEFAULT_PRICING", () => {
    it("should include both standard and hyrox plan types", () => {
      const standardPlans = DEFAULT_PRICING.filter((p) => p.plan_type === "standard");
      const hyroxPlans = DEFAULT_PRICING.filter((p) => p.plan_type === "hyrox");

      expect(standardPlans.length).toBeGreaterThanOrEqual(3);
      expect(hyroxPlans.length).toBeGreaterThanOrEqual(2);
    });

    it("should define monthly and yearly prices for every plan", () => {
      DEFAULT_PRICING.forEach((plan) => {
        expect(plan.monthly_price).toBeTruthy();
        expect(plan.yearly_price).toBeTruthy();
        expect(plan.features.length).toBeGreaterThan(0);
      });
    });
  });

  describe("DEFAULT_CONTENT", () => {
    it("should have Apex Fitness branding in hero and about", () => {
      expect(DEFAULT_CONTENT.about.headline).toBe("Apex Fitness");
      expect(DEFAULT_CONTENT.about.paragraph1).not.toContain("Skulpt");
      expect(DEFAULT_CONTENT.hero.subheadline).not.toContain("Skulpt");
    });

    it("should have valid contact details", () => {
      expect(DEFAULT_CONTENT.contact.email).toBe("info@apexfitness.com");
      expect(DEFAULT_CONTENT.contact.phone).toBeTruthy();
    });
  });

  describe("Data Fetchers (Fallback Mode)", () => {
    it("getServices should return DEFAULT_SERVICES when Supabase is offline", async () => {
      const services = await getServices();
      expect(services).toHaveLength(DEFAULT_SERVICES.length);
      expect(services[0].title).toBe(DEFAULT_SERVICES[0].title);
    });

    it("getPricingPlans should return DEFAULT_PRICING when Supabase is offline", async () => {
      const plans = await getPricingPlans();
      expect(plans.length).toBe(DEFAULT_PRICING.length);
      expect(plans[0].title).toBe(DEFAULT_PRICING[0].title);
    });

    it("getSiteContent should return DEFAULT_CONTENT when Supabase is offline", async () => {
      const content = await getSiteContent();
      expect(content.about.headline).toBe("Apex Fitness");
      expect(content.hero).toBeDefined();
    });
  });
});
