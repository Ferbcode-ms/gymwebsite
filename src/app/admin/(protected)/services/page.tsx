"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { ServiceItem } from "@/lib/cms/types";
import { DEFAULT_SERVICES } from "@/lib/cms/defaults";
import { saveServiceAction } from "./actions";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_SERVICES[0].id);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const selectedService =
    services.find((s) => s.id === selectedId) || services[0];

  const handleFieldChange = (field: keyof ServiceItem, value: string) => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, [field]: value } : item
      )
    );
  };

  // Upload image directly to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        handleFieldChange("image", data.url);
        setStatusMessage({
          type: "success",
          text: "Image uploaded to Cloudinary successfully!",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to upload image to Cloudinary",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Error uploading image to Cloudinary",
      });
    } finally {
      setUploading(false);
    }
  };

  // Save changes to Supabase
  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);

    const result = await saveServiceAction(selectedService);
    if (result.success) {
      setStatusMessage({
        type: "success",
        text: `Saved "${selectedService.title}" successfully! Changes are live.`,
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
            Aanbod Management
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Programs & Services
          </h1>
          <p className="text-white/60 text-xs sm:text-sm">
            Edit titles, descriptions, categories, and upload high-res images to Cloudinary.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="skulpt-btn-pill px-6 py-2.5 text-sm font-bold text-[var(--black-ish)] flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving to Supabase..." : "Save Program"}
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

      {/* Program Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl">
        {services.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedId(item.id);
              setStatusMessage(null);
            }}
            className={`px-5 py-3 rounded-xl font-heading text-sm uppercase font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2.5 ${
              selectedId === item.id
                ? "bg-[var(--green-yellow)] text-[var(--black-ish)] shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <span className="font-mono text-xs opacity-70">{item.num}</span>
            <span>{item.title}</span>
          </button>
        ))}
      </div>

      {/* Main Edit Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form Fields */}
        <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-heading text-xl font-bold uppercase text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--green-yellow)]" />
            Program Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Program Number
              </label>
              <input
                type="text"
                value={selectedService.num}
                onChange={(e) => handleFieldChange("num", e.target.value)}
                placeholder="01"
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Program Title
              </label>
              <input
                type="text"
                value={selectedService.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="Fitness"
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
              Category Badge
            </label>
            <input
              type="text"
              value={selectedService.category}
              onChange={(e) => handleFieldChange("category", e.target.value)}
              placeholder="Full Gym Access"
              className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={selectedService.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Describe the workout program..."
              className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Cloudinary Image URL Field */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
              Image URL (Cloudinary / CDN)
            </label>
            <div className="relative">
              <input
                type="text"
                value={selectedService.image}
                onChange={(e) => handleFieldChange("image", e.target.value)}
                placeholder="https://res.cloudinary.com/..."
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 pl-4 pr-10 text-xs font-mono text-white/80 focus:outline-none"
              />
              <a
                href={selectedService.image}
                target="_blank"
                rel="noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Direct Photo Uploader & Live Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="font-heading text-xl font-bold uppercase text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-[var(--green-yellow)]" />
              Program Photo
            </h2>

            {/* Direct Upload Dropzone */}
            <div className="relative border-2 border-dashed border-white/20 hover:border-[var(--green-yellow)]/60 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-black/20 group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[var(--green-yellow)]/10 text-[var(--green-yellow)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white">
                  {uploading ? "Uploading photo..." : "Click or drag new photo here"}
                </div>
                <p className="text-xs text-white/50">
                  Select any photo from your computer. It updates automatically.
                </p>
              </div>
            </div>

            {/* Live Interactive Preview Card */}
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-white/60 block mb-3">
                Live Preview (Services Modal Style)
              </span>

              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
                <Image
                  src={selectedService.image}
                  alt={selectedService.title}
                  fill
                  sizes="400px"
                  className="object-cover brightness-95"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-6 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--black-ish)] bg-[var(--green-yellow)] font-bold px-3 py-1 shadow-sm">
                      {selectedService.category}
                    </span>
                    <span className="font-heading text-6xl font-black text-white/20 select-none">
                      {selectedService.num}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading text-3xl font-black uppercase text-white tracking-tight">
                      {selectedService.title}
                    </h4>
                    <p className="text-xs text-white/80 line-clamp-2 mt-1">
                      {selectedService.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
