"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { PricingPlan } from "@/lib/cms/types";

export function PricingSection({ initialPlans }: { initialPlans?: PricingPlan[] } = {}) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const isYearly = billingCycle === "yearly";

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const PLANS = [
    {
      id: "individual",
      title: "Individual",
      description:
        "The premier membership to get the absolute most out of your fitness lifestyle. Go all-out with expert, friendly guidance. We're here for you every single day in the gym.",
      price: isYearly ? "€ 38,-" : "€ 44,-",
      periodNote: isYearly ? "* With a 1-year membership" : "* Monthly flexible cancellation",
      features: [
        "Unlimited training",
        "Personal coaching",
        "Free access to Group Training & classes",
        "Custom workout plans",
        "Vibrant community",
      ],
    },
    {
      id: "family",
      title: "Family",
      description:
        "Join together with family members living at the same address and receive an exclusive family discount. Join with 4 or more, and additional members train for free.",
      price: isYearly ? "€ 34,-" : "€ 40,-",
      periodNote: isYearly ? "* With a 1-year membership" : "* Monthly flexible cancellation",
      features: [
        "Unlimited training",
        "Personal coaching",
        "Free access to Group Training & classes",
        "Custom workout plans",
        "Vibrant community",
      ],
    },
    {
      id: "student",
      title: "Student",
      description:
        "Between 16 and 25 years old, studying hard, and looking to de-stress with a great workout? We have an exclusive student membership designed for you.",
      price: isYearly ? "€ 29,-" : "€ 33,-",
      periodNote: isYearly ? "* With a 1-year membership" : "* Monthly flexible cancellation",
      features: [
        "Unlimited training",
        "Personal coaching",
        "Free access to Group Training & classes",
        "Custom workout plans",
        "Vibrant community",
      ],
    },
  ];

  const HYROX_PLANS = [
    {
      id: "hyrox-basic",
      title: "Hyrox Basic",
      description:
        "Train in small cohorts alongside our certified HYROX coaches and challenge yourself to reach peak fitness.",
      price: "€ 25,-",
      features: [
        "5x per month access to Group Training",
        "Training from certified HYROX coaches",
        "Vibrant community",
      ],
    },
    {
      id: "hyrox-premium",
      title: "Hyrox Premium",
      description:
        "Train in small cohorts alongside our certified HYROX coaches and challenge yourself to reach peak fitness.",
      price: "€ 40,-",
      features: [
        "9x per month access to Group Training",
        "Training from certified HYROX coaches",
        "Vibrant community",
      ],
    },
  ];

  const standardPlans =
    initialPlans && initialPlans.length > 0
      ? initialPlans
          .filter((p) => p.plan_type === "standard")
          .map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: isYearly ? p.yearly_price : p.monthly_price,
            periodNote:
              p.period_note ||
              (isYearly ? "* With a 1-year membership" : "* Monthly flexible cancellation"),
            features: p.features,
          }))
      : PLANS;

  const hyroxPlans =
    initialPlans && initialPlans.length > 0
      ? initialPlans
          .filter((p) => p.plan_type === "hyrox")
          .map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            price: isYearly ? p.yearly_price : p.monthly_price,
            features: p.features,
          }))
      : HYROX_PLANS;

  return (
    <section id="pricing-section" className="relative w-full bg-[var(--white-ish)] py-16 sm:py-24 md:py-32">
      <div className="max-w-[1700px] w-full mx-auto px-5 sm:px-6 md:px-12">
        {/* Toggle Switcher: Per Month / Per Year */}
        <div className="flex justify-center mb-10 md:mb-16">
          <div className="inline-flex p-1 sm:p-1.5 border border-[var(--black-ish)] bg-transparent">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 sm:px-8 py-2.5 sm:py-3 font-heading text-base sm:text-xl font-bold uppercase transition-all duration-300 cursor-pointer ${
                !isYearly
                  ? "bg-[var(--green-yellow)] text-[var(--black-ish)] shadow-sm"
                  : "text-[var(--black-ish)] hover:opacity-75"
              }`}
            >
              Per month
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 sm:px-8 py-2.5 sm:py-3 font-heading text-base sm:text-xl font-bold uppercase transition-all duration-300 cursor-pointer ${
                isYearly
                  ? "bg-[var(--green-yellow)] text-[var(--black-ish)] shadow-sm"
                  : "text-[var(--black-ish)] hover:opacity-75"
              }`}
            >
              Per year
            </button>
          </div>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-stretch mb-20 md:mb-32">
          {standardPlans.map((plan) => (
            <div
              key={plan.id}
              className="border border-[var(--black-ish)] flex flex-col justify-between h-full bg-white/40 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
            >
              {/* Card Header Title */}
              <div className="border-b border-[var(--black-ish)] p-6 sm:p-8 md:p-10">
                <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[var(--black-ish)] tracking-tight">
                  {plan.title}
                </h3>
              </div>

              {/* Card Content & Features */}
              <div className="p-6 sm:p-8 md:p-10 flex-1 flex flex-col justify-between space-y-6 sm:space-y-8">
                <p className="text-base sm:text-lg text-[var(--black-ish)]/80 leading-relaxed md:min-h-[4.5rem]">
                  {plan.description}
                </p>

                {/* Features List with Clean Check Icons */}
                <ul className="space-y-3.5 sm:space-y-4 my-4 sm:my-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[var(--black-ish)]">
                      <div className="w-5 h-5 rounded-full bg-[var(--green-yellow)] flex items-center justify-center flex-shrink-0 mt-0.5 text-[var(--black-ish)]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price and CTA Block */}
                <div className="pt-6 border-t border-[var(--dark-grey)]/20 space-y-4">
                  <div>
                    <span className="block text-xs sm:text-sm font-heading uppercase text-[var(--black-ish)]/70 tracking-wider">
                      per month
                    </span>
                    <span className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-[var(--black-ish)] tracking-tight">
                      {plan.price}
                    </span>
                  </div>

                  <button
                    onClick={scrollToContact}
                    className="w-full apex-btn-pill py-3.5 sm:py-4 text-base sm:text-lg cursor-pointer"
                  >
                    Learn More
                  </button>

                  <span className="block text-xs text-[var(--black-ish)]/60 italic">
                    {plan.periodNote}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dedicated Hyrox Section */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-heading text-4xl sm:text-6xl font-black uppercase text-[var(--black-ish)] tracking-tight">
            Hyrox Memberships
          </h2>
        </div>

        {/* 2-Column Hyrox Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {hyroxPlans.map((plan) => (
            <div
              key={plan.id}
              className="border border-[var(--black-ish)] flex flex-col justify-between h-full bg-white/40 backdrop-blur-sm"
            >
              <div className="border-b border-[var(--black-ish)] p-6 sm:p-8 md:p-10">
                <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[var(--black-ish)] tracking-tight">
                  {plan.title}
                </h3>
              </div>

              <div className="p-6 sm:p-8 md:p-10 flex-1 flex flex-col justify-between space-y-6 sm:space-y-8">
                <p className="text-base sm:text-lg text-[var(--black-ish)]/80 leading-relaxed md:min-h-[3rem]">
                  {plan.description}
                </p>

                <ul className="space-y-3.5 sm:space-y-4 my-4 sm:my-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[var(--black-ish)]">
                      <div className="w-5 h-5 rounded-full bg-[var(--green-yellow)] flex items-center justify-center flex-shrink-0 mt-0.5 text-[var(--black-ish)]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-[var(--dark-grey)]/20 space-y-4">
                  <div>
                    <span className="block text-xs sm:text-sm font-heading uppercase text-[var(--black-ish)]/70 tracking-wider">
                      per month
                    </span>
                    <span className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-[var(--black-ish)] tracking-tight">
                      {plan.price}
                    </span>
                  </div>

                  <button
                    onClick={scrollToContact}
                    className="w-full apex-btn-pill py-3.5 sm:py-4 text-base sm:text-lg cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
