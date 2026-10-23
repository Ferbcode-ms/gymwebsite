import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import {
  LayoutDashboard,
  Layers,
  CreditCard,
  FileText,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { verifyAdminAuth } from "@/lib/cms/auth";
import { logoutAction } from "@/app/admin/login/actions";

export const metadata = {
  title: "Admin CMS | Apex Fitness",
  description: "Manage website content, services, pricing, and images.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const auth = await verifyAdminAuth();

  if (!auth.authorized) {
    redirect("/admin/login");
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Programs & Aanbod", href: "/admin/services", icon: Layers },
    { label: "Pricing & Plans", href: "/admin/pricing", icon: CreditCard },
    { label: "Website Text", href: "/admin/content", icon: FileText },
    { label: "Trial Inquiries", href: "/admin/leads", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#181818] text-[#f5f5f5] flex flex-col md:flex-row antialiased font-sans selection:bg-[var(--green-yellow)] selection:text-[var(--black-ish)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#121212] border-r border-white/10 flex flex-col justify-between p-6 flex-shrink-0">
        <div className="space-y-8">
          {/* Logo / Brand */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-heading text-2xl font-black uppercase tracking-tight text-white">
                Apex <span className="text-[var(--green-yellow)]">Admin</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Icon className="w-4 h-4 text-[var(--green-yellow)]/80" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading uppercase tracking-wider text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--green-yellow)]" />
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 border-b border-white/10 bg-[#141414] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--green-yellow)] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-white/70">
              Apex Fitness • Website Management
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-white/60">
            <span>Admin Mode</span>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-10 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
