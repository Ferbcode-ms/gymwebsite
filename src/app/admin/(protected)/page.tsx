import React from "react";
import Link from "next/link";
import {
  Layers,
  CreditCard,
  FileText,
  Users,
  ArrowRight,
  ExternalLink,
  Sparkles,
  PhoneCall,
  Flame,
  CheckCircle,
} from "lucide-react";
import { getServices, getPricingPlans, getLeads } from "@/lib/cms/data";

export default async function AdminDashboardPage() {
  const [services, pricing, leads] = await Promise.all([
    getServices(),
    getPricingPlans(),
    getLeads(),
  ]);

  const newLeadsCount = leads.filter((l) => (l.status || "new") === "new").length;

  const websiteSections = [
    {
      step: "01",
      title: "Hero Banner",
      description: "The top screen with 'Train Today. Grow Tomorrow.' and the free trial button.",
      href: "/admin/content",
      badge: "Top Banner",
      icon: Flame,
    },
    {
      step: "02",
      title: "3 Visual Cards",
      description: "Coaches, Equipment, and Free Coffee feature cards with photo replacement.",
      href: "/admin/content",
      badge: "Photos & Titles",
      icon: Layers,
    },
    {
      step: "03",
      title: "Programs & Aanbod",
      description: `${services.length} active programs (Fitness, Personal Training, Group Classes, Hyrox). Change text & photos directly.`,
      href: "/admin/services",
      badge: `${services.length} Programs`,
      icon: Layers,
    },
    {
      step: "04",
      title: "About Story & Checklist",
      description: "The gym story and the 7 green-bullet club features.",
      href: "/admin/content",
      badge: "Story & Features",
      icon: CheckCircle,
    },
    {
      step: "05",
      title: "Pricing & Memberships",
      description: `Monthly/yearly rates for Individual, Family, Student, and ${pricing.filter(p => p.plan_type === 'hyrox').length} Hyrox plans.`,
      href: "/admin/pricing",
      badge: `${pricing.length} Plans`,
      icon: CreditCard,
    },
    {
      step: "06",
      title: "Footer & Contact Info",
      description: "Phone number, email address, gym location, opening hours, and social media links.",
      href: "/admin/content",
      badge: "Contact & Hours",
      icon: PhoneCall,
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--green-yellow)]/10 border border-[var(--green-yellow)]/30 text-[var(--green-yellow)] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Simple Website Manager
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-tight text-white font-bold">
            Welcome to Your Admin Panel
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Choose any section of your website below to easily change text, photos, prices, or review new trial session requests from visitors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--green-yellow)] text-black font-heading uppercase text-sm font-bold hover:opacity-90 transition-opacity shrink-0 shadow-lg"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Trial Inquiries Alert if any */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg uppercase text-white font-bold">
              {newLeadsCount > 0 ? `${newLeadsCount} New Trial Request(s)` : "Customer Inquiries Inbox"}
            </h3>
            <p className="text-zinc-400 text-xs mt-0.5">
              People who filled in the free trial form on your website.
            </p>
          </div>
        </div>

        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-heading uppercase text-xs tracking-wider font-semibold transition-colors self-start sm:self-auto"
        >
          <span>View Inquiries ({leads.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Section-by-Section Editor Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-2xl uppercase tracking-tight text-white font-bold">
            Website Sections
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Click on any section to make quick updates. Changes save instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {websiteSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.step}
                href={sec.href}
                className="group relative bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-[var(--green-yellow)]/50 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--green-yellow)] bg-[var(--green-yellow)]/10 px-2.5 py-1 rounded-md border border-[var(--green-yellow)]/20">
                      Step {sec.step}
                    </span>
                    <Icon className="w-5 h-5 text-zinc-500 group-hover:text-[var(--green-yellow)] transition-colors" />
                  </div>

                  <div>
                    <h3 className="font-heading text-xl uppercase tracking-tight text-white font-bold group-hover:text-[var(--green-yellow)] transition-colors">
                      {sec.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                      {sec.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs">
                  <span className="text-zinc-500">{sec.badge}</span>
                  <span className="text-[var(--green-yellow)] font-heading uppercase tracking-wider font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Edit Section <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
