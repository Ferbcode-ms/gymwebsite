"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log minimal error details in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Application error boundary triggered:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-[var(--black-ish)] text-[var(--white-ish)] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md space-y-6">
        <span className="font-mono text-xs uppercase tracking-widest text-red-400 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10">
          Application Error
        </span>
        <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
          Something went wrong
        </h1>
        <p className="text-base text-[var(--white-ish)]/70 font-sans">
          An unexpected error occurred while loading this page. You can try refreshing or returning to the homepage.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="apex-btn-pill px-6 py-3 text-base font-bold text-[var(--black-ish)] inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 text-base font-bold inline-flex items-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
