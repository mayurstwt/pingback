import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { CopyPingUrlButton } from "@/components/copy-ping-url-button";
import { DeleteHeartbeatButton } from "@/components/delete-heartbeat-button";
import { SetupForm } from "@/components/setup-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getHeartbeatByManageToken, getPingUrl } from "@/lib/heartbeats";
import { formatDistanceToNow, formatFrequency } from "@/lib/utils";

type SetupPageProps = {
  params: Promise<{
    manageToken: string;
  }>;
};

export default async function SetupPage({ params }: SetupPageProps) {
  const { manageToken } = await params;
  const heartbeat = await getHeartbeatByManageToken(manageToken);

  if (!heartbeat) {
    notFound();
  }

  const pingUrl = getPingUrl(heartbeat.ping_key);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Badge>{heartbeat.status === "silent" ? "Silent" : "Running"}</Badge>
      </div>

      <section className="grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle>Setup heartbeat</CardTitle>
            <CardDescription>
              Configure where alerts go and how often Pingback should expect a signal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetupForm heartbeat={heartbeat} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Get to first value</CardTitle>
              <CardDescription>
                Finish these steps once so you know the monitor is actually working.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">1. Copy the ping URL</p>
                <p className="mt-2">Add it as a webhook or HTTP request step in the workflow you want to watch.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">2. Trigger one test run</p>
                <p className="mt-2">Use your actual automation or the test endpoint button below to send a first ping.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">3. Confirm the timestamp updates</p>
                <p className="mt-2">Check the “Last ping” field on this page. Once it updates, monitoring is live.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Ping endpoint</CardTitle>
              <CardDescription>
                Add this URL as a webhook or HTTP request step in your automation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-[var(--muted-foreground)]">
                <code className="break-all text-[13px] text-white">{pingUrl}</code>
              </div>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[var(--muted-foreground)]">
                <p className="font-medium text-white">Integration notes</p>
                <p>Zapier: use a webhook or request step near the end of the happy-path flow.</p>
                <p>Make: add an HTTP module that performs a GET request to this URL.</p>
                <p>GoHighLevel: call this endpoint after the key action succeeds.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <CopyPingUrlButton pingUrl={pingUrl} />
                <Button asChild variant="outline">
                  <a href={pingUrl} target="_blank" rel="noreferrer">
                    Test endpoint
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle>Current status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center justify-between gap-4">
                <span>Expected frequency</span>
                <span className="text-white">{formatFrequency(heartbeat.expected_frequency_hours)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <span>Last ping</span>
                <span className="text-white">{formatDistanceToNow(heartbeat.last_ping_at)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <span>Last alert</span>
                <span className="text-white">{formatDistanceToNow(heartbeat.last_alert_sent_at)}</span>
              </div>
            </CardContent>
          </Card>

          <DeleteHeartbeatButton manageToken={heartbeat.manage_token} />
        </div>
      </section>
    </main>
  );
}
