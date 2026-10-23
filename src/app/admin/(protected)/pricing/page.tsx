"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Check,
} from "lucide-react";
import { PricingPlan } from "@/lib/cms/types";
import { DEFAULT_PRICING } from "@/lib/cms/defaults";
import { savePricingAction } from "./actions";

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PRICING);
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_PRICING[0].id);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const selectedPlan = plans.find((p) => p.id === selectedId) || plans[0];

  const handleFieldChange = (field: keyof PricingPlan, value: any) => {
    setPlans((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...selectedPlan.features];
    updatedFeatures[index] = value;
    handleFieldChange("features", updatedFeatures);
  };

  const handleAddFeature = () => {
    handleFieldChange("features", [...selectedPlan.features, "New feature"]);
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = selectedPlan.features.filter((_, i) => i !== index);
    handleFieldChange("features", updatedFeatures);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);

    const result = await savePricingAction(selectedPlan);
    if (result.success) {
      setStatusMessage({
        type: "success",
        text: `Saved plan "${selectedPlan.title}" successfully! Changes are live.`,
      });
    } else {
      setStatusMessage({
        type: "error",
        text: result.error || "Could not save to Supabase. Check configuration.",
      });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--green-yellow)]">
            Membership Management
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Pricing & Memberships
          </h1>
          <p className="text-white/60 text-xs sm:text-sm">
            Adjust monthly & yearly fees, billing notes, and feature checklists.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="skulpt-btn-pill px-6 py-2.5 text-sm font-bold text-[var(--black-ish)] flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving to Supabase..." : "Save Plan"}
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm border ${
            statusMessage.type === "success"
              ? "bg-[var(--green-yellow)]/10 border-[var(--green-yellow)]/40 text-[var(--green-yellow)]"
              : "bg-red-500/10 border-red-500/40 text-red-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Plan Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl">
        {plans.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedId(item.id);
              setStatusMessage(null);
            }}
            className={`px-5 py-3 rounded-xl font-heading text-sm uppercase font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              selectedId === item.id
                ? "bg-[var(--green-yellow)] text-[var(--black-ish)] shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <span>{item.title}</span>
            <span className="font-mono text-xs opacity-75">
              ({item.yearly_price}/mo)
            </span>
          </button>
        ))}
      </div>

      {/* Form & Live Card Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Edit Form */}
        <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-heading text-xl font-bold uppercase text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[var(--green-yellow)]" />
            Plan Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Plan Title
              </label>
              <input
                type="text"
                value={selectedPlan.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="Individual"
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Plan Type
              </label>
              <select
                value={selectedPlan.plan_type}
                onChange={(e) =>
                  handleFieldChange("plan_type", e.target.value as any)
                }
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="standard" className="bg-neutral-900 text-white">
                  Standard Membership
                </option>
                <option value="hyrox" className="bg-neutral-900 text-white">
                  HYROX Program
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Yearly Rate (per month)
              </label>
              <input
                type="text"
                value={selectedPlan.yearly_price}
                onChange={(e) =>
                  handleFieldChange("yearly_price", e.target.value)
                }
                placeholder="€ 38,-"
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Monthly Rate (per month)
              </label>
              <input
                type="text"
                value={selectedPlan.monthly_price}
                onChange={(e) =>
                  handleFieldChange("monthly_price", e.target.value)
                }
                placeholder="€ 44,-"
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
              Period / Contract Note
            </label>
            <input
              type="text"
              value={selectedPlan.period_note || ""}
              onChange={(e) =>
                handleFieldChange("period_note", e.target.value)
              }
              placeholder="* With a 1-year membership"
              className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={selectedPlan.description}
              onChange={(e) =>
                handleFieldChange("description", e.target.value)
              }
              className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Features Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60">
                Included Features
              </label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-xs text-[var(--green-yellow)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Feature
              </button>
            </div>

            <div className="space-y-2">
              {selectedPlan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    className="flex-1 bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-2 px-3 text-xs sm:text-sm text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-2 text-white/40 hover:text-red-400 cursor-pointer"
                    aria-label="Remove feature"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <span className="font-mono text-xs uppercase tracking-wider text-white/60 block">
            Live Pricing Card Preview
          </span>

          <div className="p-8 rounded-3xl bg-[var(--white-ish)] text-[var(--black-ish)] border border-black/10 shadow-2xl space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-black/50 block mb-1">
                {selectedPlan.plan_type === "hyrox" ? "Official Affiliate" : "Membership"}
              </span>
              <h3 className="font-heading text-4xl font-black uppercase tracking-tight text-[var(--black-ish)]">
                {selectedPlan.title}
              </h3>
            </div>

            <div className="space-y-1">
              <div className="font-heading text-5xl font-black tracking-tight text-[var(--black-ish)]">
                {selectedPlan.yearly_price}
              </div>
              <p className="text-xs text-black/60 font-mono">
                {selectedPlan.period_note || "* With a 1-year membership"}
              </p>
            </div>

            <p className="text-sm text-black/80 leading-relaxed">
              {selectedPlan.description}
            </p>

            <div className="pt-4 border-t border-black/10">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-black/60 block mb-3">
                Included Features:
              </span>
              <ul className="space-y-2.5">
                {selectedPlan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-black/90">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="w-full skulpt-btn-pill py-3 text-sm font-bold text-[var(--black-ish)] mt-4"
            >
              Select {selectedPlan.title}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
