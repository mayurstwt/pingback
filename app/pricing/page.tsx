import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/lib/env";

const navLinks: Array<{ href: Route; label: string }> = [
  { href: "/#see-in-action", label: "See in Action" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#why-use-pingback", label: "Why use Pingback" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faqs", label: "FAQs" },
];

const planItems = [
  "1 monitored workflow heartbeat",
  "1-minute cron checks",
  "Email alerts when a heartbeat goes silent",
  "Direct setup link and ping endpoint",
  "Cancel anytime",
];

export default function PricingPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10 sm:px-8">
      <MarketingNavbar links={navLinks} />

      <section className="grid gap-10 py-12 lg:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Badge>$7/month</Badge>
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--primary)]">Pricing</p>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            One plan. One job. Keep your automation alive.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
            Pay through Polar, land on the setup screen, add the ping URL to your workflow, and
            receive an alert when silence starts costing you leads.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Best for one high-value workflow you cannot afford to lose track of",
              "No complex setup or dashboard training required",
              "Designed to get to first test ping in a few minutes",
              "Straight monthly pricing with no contract",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-[var(--muted-foreground)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle>Automation Heartbeat</CardTitle>
            <CardDescription>
              Polar handles payment. Pingback handles the monitoring loop.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-4xl font-semibold text-white">$7</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">per month</p>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              Start with one critical workflow. Cancel anytime if it does not earn its place.
            </div>

            <div className="space-y-3">
              {planItems.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {env.POLAR_CHECKOUT_URL ? (
              <Button asChild size="lg" className="w-full">
                <a href={env.POLAR_CHECKOUT_URL}>
                  Continue to Polar checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : (
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                Set `POLAR_CHECKOUT_URL` to your hosted Polar checkout link. The success URL
                should point to `/setup/claim`.
              </div>
            )}

            <p className="text-xs leading-6 text-[var(--muted)]">
              Recommended Polar success URL: <code>{`${env.APP_URL}/setup/claim`}</code>
            </p>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-[var(--muted-foreground)]">
              <p className="font-medium text-white">What happens after payment</p>
              <p>1. Polar sends you to the Pingback setup page.</p>
              <p>2. You name the workflow and paste the ping URL into your automation.</p>
              <p>3. You trigger one test ping and confirm the monitor is active.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
