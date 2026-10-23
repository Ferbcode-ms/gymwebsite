import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[var(--black-ish)] text-[var(--white-ish)] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md space-y-6">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--green-yellow)] px-3 py-1 rounded-full border border-[var(--green-yellow)]/30 bg-[var(--green-yellow)]/10">
          Error 404
        </span>
        <h1 className="font-heading text-5xl sm:text-7xl font-black uppercase tracking-tight text-white">
          Page Not Found
        </h1>
        <p className="text-base sm:text-lg text-[var(--white-ish)]/70 font-sans">
          The page or workout section you are looking for has moved, expired, or doesn&apos;t exist.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="apex-btn-pill px-8 py-3.5 text-base sm:text-lg font-bold text-[var(--black-ish)] inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
