"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, ShieldAlert, ShieldCheck } from "lucide-react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--black-ish)] text-[var(--white-ish)] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--green-yellow)]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex justify-between items-center relative z-10 max-w-5xl w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-[var(--white-ish)]/70 hover:text-[var(--green-yellow)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--green-yellow)] px-3 py-1 rounded-full border border-[var(--green-yellow)]/30 bg-[var(--green-yellow)]/10">
          Secure CMS Portal
        </span>
      </div>

      {/* Center Card */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10 py-12">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-[var(--white-ish)] mb-2">
            Apex CMS
          </h1>
          <p className="text-sm text-[var(--white-ish)]/60 font-sans">
            Sign in with your verified administrator credentials.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white/[0.03] backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl"
        >
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-xs uppercase tracking-wider text-[var(--white-ish)]/70 mb-2"
            >
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@apexfitness.com"
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--white-ish)] placeholder-white/30 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-xs uppercase tracking-wider text-[var(--white-ish)]/70 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full bg-black/40 border border-white/15 focus:border-[var(--green-yellow)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--white-ish)] placeholder-white/30 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full skulpt-btn-pill py-3 text-base font-bold text-[var(--black-ish)] flex items-center justify-center gap-2 cursor-pointer mt-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Sign In to Admin"}
          </button>

          {/* Security notice badge */}
          <div className="pt-3 border-t border-white/10 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs text-white/50">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--green-yellow)]" />
              <span>Supabase Auth Protected • Rate-Limiting Active</span>
            </div>
          </div>
        </form>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-white/40 relative z-10 max-w-md mx-auto">
        <span>Powered by Supabase Auth • Apex Fitness</span>
      </div>
    </div>
  );
}
