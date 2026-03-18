import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

type MarketingNavbarProps = {
  links: Array<{
    href: Route;
    label: string;
  }>;
};

export async function MarketingNavbar({ links }: MarketingNavbarProps) {
  const session = await auth();
  const dashboardHref = session?.user?.email ? "/dashboard" : "/auth";
  const dashboardLabel = session?.user?.email ? "Dashboard" : "Sign in";

  return (
    <header className="sticky top-0 z-30">
      <div className="glass mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-[1.75rem] border border-white/10 px-4 py-4 shadow-lg shadow-black/20 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Clock3 className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">Pingback</p>
            <p className="text-xs text-[var(--muted)] sm:text-sm">Heartbeat monitoring</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--muted-foreground)] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href={dashboardHref}>{dashboardLabel}</Link>
          </Button>
          <Button asChild className="px-4 sm:px-5">
            <Link href="/pricing">
              Start now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <nav className="mx-auto mt-3 flex w-full max-w-6xl flex-wrap gap-2 px-1 lg:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
