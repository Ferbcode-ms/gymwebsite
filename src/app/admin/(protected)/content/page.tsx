"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Type,
  Activity,
  Phone,
  Sparkles,
  LayoutGrid,
  Upload,
} from "lucide-react";
import { SiteContent, FeatureCardItem } from "@/lib/cms/types";
import { DEFAULT_CONTENT, DEFAULT_FEATURE_CARDS } from "@/lib/cms/defaults";
import { saveContentAction } from "./actions";

type TabType = "hero" | "features" | "about" | "marquee" | "editorial" | "contact";

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpdate = (section: keyof SiteContent, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleHighlightChange = (index: number, value: string) => {
    setContent((prev) => {
      const highlights = [...prev.about.highlights];
      highlights[index] = value;
      return {
        ...prev,
        about: {
          ...prev.about,
          highlights,
        },
      };
    });
  };

  const addHighlight = () => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        highlights: [...prev.about.highlights, "New club benefit or feature"],
      },
    }));
  };

  const removeHighlight = (index: number) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        highlights: prev.about.highlights.filter((_, idx) => idx !== index),
      },
    }));
  };

  // Feature Card title & image handlers
  const handleCardTitleChange = (index: number, title: string) => {
    setContent((prev) => {
      const cards = [...(prev.feature_cards || DEFAULT_FEATURE_CARDS)];
      cards[index] = { ...cards[index], title };
      return { ...prev, feature_cards: cards };
    });
  };

  const handleCardImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
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
        setContent((prev) => {
          const cards = [...(prev.feature_cards || DEFAULT_FEATURE_CARDS)];
          cards[index] = { ...cards[index], image: data.url };
          return { ...prev, feature_cards: cards };
        });
        setStatusMessage({
          type: "success",
          text: `Photo updated! Click "Save Visual Cards" to make it live.`,
        });
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to upload image",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Error uploading image to server",
      });
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async (section: keyof SiteContent) => {
    setSaving(true);
    setStatusMessage(null);

    const dataToSave = content[section] ?? (DEFAULT_CONTENT as any)[section];
    const result = await saveContentAction(section, dataToSave);
    if (result.success) {
      setStatusMessage({
        type: "success",
        text: `Saved ${section.toUpperCase().replace("_", " ")} successfully! Changes are live on your website.`,
      });
    } else {
      setStatusMessage({
        type: "error",
        text: result.error || "Could not save. Please check your connection.",
      });
    }
    setSaving(false);
  };

  const currentSaveKey: keyof SiteContent = activeTab === "features" ? "feature_cards" : activeTab;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--green-yellow)]">
            Website Section Content
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Website Text & Photos
          </h1>
          <p className="text-white/60 text-xs sm:text-sm">
            Select a website section below to update titles, story, moving text, and photos.
          </p>
        </div>

        <button
          onClick={() => handleSave(currentSaveKey)}
          disabled={saving}
          className="skulpt-btn-pill px-6 py-2.5 text-sm font-bold text-[var(--black-ish)] flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Section"}
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

      {/* Section Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl">
        {[
          { id: "hero", label: "1. Hero Banner", icon: Sparkles },
          { id: "features", label: "2. 3 Visual Cards", icon: LayoutGrid },
          { id: "about", label: "3. About & Checklist", icon: FileText },
          { id: "marquee", label: "4. Moving Tickers", icon: Activity },
          { id: "editorial", label: "5. Bold Quote", icon: Type },
          { id: "contact", label: "6. Contact & Footer", icon: Phone },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                setStatusMessage(null);
              }}
              className={`px-5 py-3 rounded-xl font-heading text-sm uppercase font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[var(--green-yellow)] text-[var(--black-ish)] shadow-md"
                  : "text-white/70 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6">
        {/* 1. HERO TAB */}
        {activeTab === "hero" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Top Eyebrow Badge
              </label>
              <input
                type="text"
                value={content.hero.badge}
                onChange={(e) => handleUpdate("hero", "badge", e.target.value)}
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Main Big Headline
              </label>
              <input
                type="text"
                value={content.hero.headline}
                onChange={(e) => handleUpdate("hero", "headline", e.target.value)}
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm font-heading uppercase text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Subheadline / Description
              </label>
              <textarea
                rows={3}
                value={content.hero.subheadline}
                onChange={(e) =>
                  handleUpdate("hero", "subheadline", e.target.value)
                }
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={content.hero.cta_primary}
                  onChange={(e) =>
                    handleUpdate("hero", "cta_primary", e.target.value)
                  }
                  className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={content.hero.cta_secondary}
                  onChange={(e) =>
                    handleUpdate("hero", "cta_secondary", e.target.value)
                  }
                  className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. THREE VISUAL CARDS TAB */}
        {activeTab === "features" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-xl uppercase font-bold text-white">
                3 Visual Grid Cards (Coaches, Equipment, Coffee)
              </h3>
              <p className="text-zinc-400 text-xs mt-1">
                These are the three prominent photo cards displayed on the homepage. Change the titles or click &quot;Change Photo&quot; to pick any image from your computer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(content.feature_cards || DEFAULT_FEATURE_CARDS).map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-[var(--green-yellow)] font-bold">
                      Card 0{idx + 1}
                    </span>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-1.5">
                        Card Title
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleCardTitleChange(idx, e.target.value)}
                        className="w-full bg-black/60 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-2.5 px-3.5 text-sm font-heading uppercase text-white focus:outline-none"
                      />
                    </div>

                    {/* Photo Preview */}
                    <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-neutral-900 border border-white/10">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="300px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Direct Photo Uploader */}
                  <div className="relative border border-dashed border-white/20 hover:border-[var(--green-yellow)]/60 rounded-xl p-3 text-center transition-colors cursor-pointer bg-black/20 group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCardImageUpload(idx, e)}
                      disabled={uploadingIndex === idx}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center justify-center gap-2 text-xs font-heading uppercase tracking-wider text-white group-hover:text-[var(--green-yellow)] transition-colors">
                      <Upload className="w-4 h-4 text-[var(--green-yellow)]" />
                      <span>{uploadingIndex === idx ? "Uploading Photo..." : "Change Photo"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. ABOUT TAB */}
        {activeTab === "about" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Section Headline
              </label>
              <input
                type="text"
                value={content.about.headline}
                onChange={(e) => handleUpdate("about", "headline", e.target.value)}
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm font-heading uppercase text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                First Story Paragraph
              </label>
              <textarea
                rows={4}
                value={content.about.paragraph1}
                onChange={(e) =>
                  handleUpdate("about", "paragraph1", e.target.value)
                }
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Second Story Paragraph
              </label>
              <textarea
                rows={4}
                value={content.about.paragraph2}
                onChange={(e) =>
                  handleUpdate("about", "paragraph2", e.target.value)
                }
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Highlights List */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--green-yellow)]">
                  Green Bullet Highlights (Checklist)
                </label>
                <button
                  type="button"
                  onClick={addHighlight}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-heading uppercase text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Bullet Point
                </button>
              </div>

              <div className="space-y-2">
                {content.about.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--green-yellow)] flex-shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleHighlightChange(idx, e.target.value)
                      }
                      className="flex-1 bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-2 px-3 text-sm text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="p-2 text-white/40 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. MARQUEE TAB */}
        {activeTab === "marquee" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Top Lime Green Continuous Marquee
              </label>
              <input
                type="text"
                value={content.marquee.text1}
                onChange={(e) =>
                  handleUpdate("marquee", "text1", e.target.value)
                }
                placeholder="START FAST. FINISH FASTER."
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm font-heading uppercase text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Footer Continuous Marquee
              </label>
              <input
                type="text"
                value={content.marquee.text2}
                onChange={(e) =>
                  handleUpdate("marquee", "text2", e.target.value)
                }
                placeholder="WANT TO KNOW MORE?"
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm font-heading uppercase text-white focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 5. EDITORIAL TAB */}
        {activeTab === "editorial" && (
          <div className="space-y-6 max-w-3xl">
            <p className="text-sm text-white/60">
              The bold large-type center quote with animated scroll physics.
            </p>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Line 1
              </label>
              <input
                type="text"
                value={content.editorial.line1}
                onChange={(e) =>
                  handleUpdate("editorial", "line1", e.target.value)
                }
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm font-heading uppercase text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Line 2
              </label>
              <input
                type="text"
                value={content.editorial.line2}
                onChange={(e) =>
                  handleUpdate("editorial", "line2", e.target.value)
                }
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm font-heading uppercase text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Line 3
              </label>
              <input
                type="text"
                value={content.editorial.line3}
                onChange={(e) =>
                  handleUpdate("editorial", "line3", e.target.value)
                }
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm font-heading uppercase text-white focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 6. CONTACT TAB */}
        {activeTab === "contact" && (
          <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={content.contact.phone}
                  onChange={(e) =>
                    handleUpdate("contact", "phone", e.target.value)
                  }
                  className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) =>
                    handleUpdate("contact", "email", e.target.value)
                  }
                  className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Gym Location Address
              </label>
              <input
                type="text"
                value={content.contact.address}
                onChange={(e) =>
                  handleUpdate("contact", "address", e.target.value)
                }
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                Opening Hours
              </label>
              <input
                type="text"
                value={content.contact.hours}
                onChange={(e) =>
                  handleUpdate("contact", "hours", e.target.value)
                }
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={content.contact.facebook_url}
                  onChange={(e) =>
                    handleUpdate("contact", "facebook_url", e.target.value)
                  }
                  className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/60 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={content.contact.instagram_url}
                  onChange={(e) =>
                    handleUpdate("contact", "instagram_url", e.target.value)
                  }
                  className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
