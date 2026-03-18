import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Bell, ShieldCheck, Workflow } from "lucide-react";

import { FaqAccordion } from "@/components/faq-accordion";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navLinks: Array<{ href: Route; label: string }> = [
  { href: "#see-in-action", label: "See in Action" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#why-use-pingback", label: "Why use Pingback" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faqs", label: "FAQs" },
];

const actionCards = [
  {
    title: "Heartbeat URL",
    description:
      "Paste one generated URL into Zapier, Make, or GoHighLevel.",
    icon: Workflow,
  },
  {
    title: "Last ping check",
    description:
      "Pingback watches for missed runs and flags the workflow the moment it goes quiet.",
    icon: Bell,
  },
  {
    title: "Email alert",
    description:
      "You get a simple alert instead of discovering the issue hours later.",
    icon: ShieldCheck,
  },
];

const whyUseCards = [
  {
    title: "Easy to notice failure",
    description:
      "Most no-code automations fail silently. Pingback turns silence into a visible signal.",
  },
  {
    title: "Fast to set up",
    description:
      "Create the monitor, drop in the URL, send a test ping, and you are done.",
  },
  {
    title: "Built for one job",
    description:
      "No logs, no dashboards, no heavy observability workflow. Just heartbeat monitoring.",
  },
];

const faqItems = [
  {
    question: "How quickly will I know something broke?",
    answer:
      "Pingback checks for missed heartbeats every minute. If an expected ping stops arriving, the linked email gets the alert on the next check cycle.",
  },
  {
    question: "Who is this for?",
    answer:
      "Operators, agencies, founders, and no-code builders running workflows where silence means lost leads, missed follow-ups, or hidden operational failures.",
  },
  {
    question: "What is the fastest way to test it?",
    answer:
      "After setup, open the generated ping URL once to simulate a successful run. Your dashboard should show the latest ping immediately.",
  },
];

const steps = [
  "Choose the plan and create your monitor.",
  "Paste the ping URL into your automation.",
  "Send one test run to confirm it is live.",
  "Get alerted if expected pings stop arriving.",
];

export default async function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <MarketingNavbar links={navLinks} />

        <section className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="space-y-7">
            <Badge>For Zapier, Make, and GoHighLevel</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Catch silent automation failures before they cost you.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-[var(--muted-foreground)]">
                Pingback listens for heartbeat pings from your workflow and emails you when they
                stop. Simple setup, simple signal.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/pricing">
                  Start monitoring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#see-in-action">See in Action</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "1-minute checks",
                "Email alerts",
                "$7/month",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--muted-foreground)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card id="see-in-action" className="glass border-white/10 shadow-2xl shadow-black/30">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                  See in Action
                </p>
                <CardTitle className="mt-2 text-2xl">A monitor you can scan in seconds</CardTitle>
              </div>
              <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                Monitoring
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: "Lead intake to CRM",
                  status: "Running",
                  detail: "Last ping 4 minutes ago",
                  silent: false,
                },
                {
                  name: "Booked call confirmation",
                  status: "Silent",
                  detail: "Expected every hour, missing for 71 minutes",
                  silent: true,
                },
                {
                  name: "Invoice paid follow-up",
                  status: "Running",
                  detail: "Last ping 12 minutes ago",
                  silent: false,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.detail}</p>
                    </div>
                    <div
                      className={cn(
                        "rounded-full px-3 py-1 text-sm",
                        item.silent
                          ? "border border-rose-400/30 bg-rose-400/10 text-rose-200"
                          : "border border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
                      )}
                    >
                      {item.status}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section id="how-it-works" className="space-y-8 py-16">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--primary)]">
              How it works
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Four steps from checkout to live protection.
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {actionCards.map(({ title, description, icon: Icon }) => (
              <Card key={title} className="glass border-white/10">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6">
                    <Icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-[var(--muted-foreground)]">{description}</CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-slate-950/30 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
                  0{index + 1}
                </p>
                <p className="mt-4 text-base leading-7 text-[var(--muted-foreground)]">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="why-use-pingback" className="space-y-8 py-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--primary)]">
              Why use Pingback
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Built for operators who do not want to babysit automations.
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {whyUseCards.map((item) => (
            <Card key={item.title} className="glass border-white/10">
              <CardContent className="space-y-3 p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--primary)]">
                  Why use Pingback
                </p>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
          </div>
        </section>

        <section id="pricing" className="py-10">
          <Card className="glass border-white/10">
            <CardContent className="flex flex-col items-start justify-between gap-5 p-8 lg:flex-row lg:items-center">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--primary)]">
                  Pricing
                </p>
                <h3 className="text-2xl font-semibold text-white">$7/month for one critical workflow</h3>
                <p className="max-w-2xl text-[var(--muted-foreground)]">
                  One monitor, one ping URL, and an email alert when the workflow goes silent.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/pricing">
                  View pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="faqs" className="py-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--primary)]">FAQ</p>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Questions before you start.
            </h2>
          </div>
          <div className="mt-6">
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/10 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>Questions before buying? Email support@pingback.app</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/auth" className="hover:text-white">
              Dashboard login
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
