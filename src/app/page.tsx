import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StickyMedia } from "@/components/StickyMedia";
import { EditorialTypography } from "@/components/EditorialTypography";
import { FeatureCards } from "@/components/FeatureCards";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { getServices, getPricingPlans, getSiteContent } from "@/lib/cms/data";

// Revalidate every hour, or instantly on CMS save via revalidatePath('/')
export const revalidate = 3600;

export default async function Home() {
  const [services, pricingPlans, siteContent] = await Promise.all([
    getServices(),
    getPricingPlans(),
    getSiteContent(),
  ]);

  return (
    <div className="relative min-h-screen w-full bg-[var(--white-ish)] text-[var(--black-ish)] selection:bg-[var(--green-yellow)] selection:text-[var(--black-ish)]">
      {/* Fixed Floating Navigation & Drawer */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="w-full">
        {/* Hero & Sticky Media Parallax Stage */}
        <div className="relative w-full">
          {/* 1. Hero Section (Sticky at top) */}
          <Hero initialHero={siteContent.hero} />

          {/* 2. Sticky Media & Dark Transition */}
          <StickyMedia />
        </div>

        {/* 3. Dark Editorial Typography ("JOUW BANK LIGT VEEL...") */}
        <EditorialTypography />

        {/* 4. Three-Card Visual Grid */}
        <FeatureCards initialCards={siteContent.feature_cards} />

        {/* 5. Lime Green Continuous Marquee Ticker */}
        <MarqueeTicker text={siteContent.marquee?.text1 || "START FAST. FINISH FASTER."} />

        {/* 6. Apex Fitness Story & Green Checklist */}
        <AboutSection initialAbout={siteContent.about} />

        {/* 7. Services / Aanbod Interactive Hover Section */}
        <ServicesSection initialServices={services} />

        {/* 8. Pricing & Membership Tabs (Monthly / Yearly + Hyrox) */}
        <PricingSection initialPlans={pricingPlans} />
      </main>

      {/* 9. Footer with Marquee, Form & Socials */}
      <Footer />
    </div>
  );
}
