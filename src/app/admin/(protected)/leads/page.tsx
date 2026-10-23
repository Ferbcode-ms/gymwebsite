"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Copy,
  Check
} from "lucide-react";
import { LeadItem } from "@/lib/cms/types";
import { updateLeadStatus, deleteLead } from "./actions";

const DEMO_LEADS: LeadItem[] = [
  {
    id: "demo-1",
    created_at: "2026-10-22T10:30:00.000Z",
    name: "Sophie van Dijk",
    phone: "+31 6 1234 5678",
    email: "sophie.vandijk@example.com",
    message: "Interested in the Hyrox competition prep program and personal training schedule.",
    status: "new",
  },
  {
    id: "demo-2",
    created_at: "2026-10-22T08:00:00.000Z",
    name: "Lars de Jong",
    phone: "+31 6 9876 5432",
    email: "lars.dejong@example.com",
    message: "Would like to book a free trial session this Saturday morning around 10am.",
    status: "contacted",
  },
  {
    id: "demo-3",
    created_at: "2026-10-21T14:15:00.000Z",
    name: "Emma Bakker",
    phone: "+31 6 5555 4444",
    email: "emma.bakker@example.com",
    message: "Inquiring about family membership options for 3 adults.",
    status: "contacted",
  },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>(DEMO_LEADS);
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "archived">("all");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try fetching actual leads from API
    async function fetchLeads() {
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setLeads(data);
          }
        }
      } catch {
        // keep demo leads as fallback
      }
    }
    fetchLeads();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = async (leadId: string, newStatus: "new" | "contacted" | "archived") => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    await updateLeadStatus(leadId, newStatus);
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    await deleteLead(leadId);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = filter === "all" || (lead.status || "new") === filter;
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.toLowerCase().includes(search.toLowerCase()) ||
      (lead.message && lead.message.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const countNew = leads.filter((l) => (l.status || "new") === "new").length;
  const countContacted = leads.filter((l) => l.status === "contacted").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-[var(--green-yellow)]" />
            Leads & Inquiries
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Review contact form submissions, free trial requests, and inquiries in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-[var(--green-yellow)]/10 border border-[var(--green-yellow)]/30 text-[var(--green-yellow)] text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--green-yellow)] animate-pulse" />
            {countNew} New {countNew === 1 ? "Lead" : "Leads"}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold">
            {countContacted} Contacted
          </div>
        </div>
      </div>

      {/* Controls: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl backdrop-blur-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--green-yellow)] transition-colors placeholder:text-zinc-600"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800/80 rounded-lg self-start sm:self-auto">
          {(["all", "new", "contacted", "archived"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-heading uppercase tracking-wider rounded transition-colors ${
                filter === tab
                  ? "bg-[var(--green-yellow)] text-black font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
            <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-white font-heading text-lg uppercase">No leads found</h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto mt-1">
              {search
                ? `No submissions matched "${search}". Try clearing your search.`
                : "Form submissions from the public website will show up here immediately."}
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const isNew = (lead.status || "new") === "new";
            const dateStr = new Date(lead.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={lead.id}
                className={`group relative bg-zinc-900/70 border rounded-2xl p-6 transition-all duration-200 hover:border-zinc-700 ${
                  isNew
                    ? "border-[var(--green-yellow)]/30 shadow-[0_0_20px_rgba(208,255,0,0.05)]"
                    : "border-zinc-800/80"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left: Contact Info & Message */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-heading text-xl uppercase tracking-tight text-white font-bold">
                        {lead.name}
                      </span>
                      <span
                        className={`text-[10px] font-heading uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isNew
                            ? "bg-[var(--green-yellow)]/15 border-[var(--green-yellow)]/40 text-[var(--green-yellow)] font-bold"
                            : lead.status === "contacted"
                            ? "bg-blue-500/15 border-blue-500/40 text-blue-400 font-medium"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400"
                        }`}
                      >
                        {lead.status || "new"}
                      </span>
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {dateStr}
                      </span>
                    </div>

                    {/* Email & Phone */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
                      <div className="flex items-center gap-2 bg-zinc-950/60 border border-zinc-800 px-3 py-1.5 rounded-lg">
                        <Mail className="w-4 h-4 text-[var(--green-yellow)]" />
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-[var(--green-yellow)] transition-colors underline-offset-2 hover:underline"
                        >
                          {lead.email}
                        </a>
                        <button
                          onClick={() => handleCopy(lead.email, `${lead.id}-email`)}
                          className="text-zinc-500 hover:text-white transition-colors ml-1 p-0.5"
                          title="Copy email"
                        >
                          {copiedId === `${lead.id}-email` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 bg-zinc-950/60 border border-zinc-800 px-3 py-1.5 rounded-lg">
                        <Phone className="w-4 h-4 text-[var(--green-yellow)]" />
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:text-[var(--green-yellow)] transition-colors underline-offset-2 hover:underline"
                        >
                          {lead.phone}
                        </a>
                        <button
                          onClick={() => handleCopy(lead.phone, `${lead.id}-phone`)}
                          className="text-zinc-500 hover:text-white transition-colors ml-1 p-0.5"
                          title="Copy phone"
                        >
                          {copiedId === `${lead.id}-phone` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Message */}
                    {lead.message && (
                      <div className="mt-3 bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 text-sm text-zinc-300 flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                        <p className="whitespace-pre-wrap leading-relaxed">{lead.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 pt-2 lg:pt-0">
                    <select
                      value={lead.status || "new"}
                      onChange={(e) =>
                        handleStatusChange(
                          lead.id,
                          e.target.value as "new" | "contacted" | "archived"
                        )
                      }
                      className="bg-zinc-950 border border-zinc-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--green-yellow)] cursor-pointer"
                    >
                      <option value="new">Mark as New</option>
                      <option value="contacted">Mark as Contacted</option>
                      <option value="archived">Mark as Archived</option>
                    </select>

                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
