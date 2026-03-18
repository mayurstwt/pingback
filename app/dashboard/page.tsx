import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Clock3, ExternalLink } from "lucide-react";

import { auth } from "@/auth";
import { signOutAction } from "@/app/auth/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getHeartbeatsByEmail } from "@/lib/heartbeats";
import { formatDistanceToNow, formatFrequency } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/auth/login");
  }

  const heartbeats = await getHeartbeatsByEmail(email);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10 sm:px-8">
      <section className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <Card className="glass h-fit border-white/10">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Signed in as {email}. Heartbeats for this email load automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form action={signOutAction}>
              <Button type="submit" variant="secondary" className="w-full">
                Sign out
              </Button>
            </form>
            <Button asChild variant="outline" className="w-full">
              <Link href="/pricing">
                Create a new heartbeat
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--primary)]">Heartbeats</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {email}
              </h1>
            </div>
            <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--muted-foreground)] sm:block">
              {heartbeats.length} item{heartbeats.length === 1 ? "" : "s"}
            </div>
          </div>

          {heartbeats.length === 0 ? (
            <Card className="glass border-white/10">
              <CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
                  <Clock3 className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">No heartbeats loaded yet</h2>
                  <p className="max-w-md text-[var(--muted-foreground)]">
                    This account does not have any heartbeats yet. Create a monitored automation
                    from the pricing page using this same email address.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            heartbeats.map((heartbeat) => (
              <Card key={heartbeat.id} className="glass border-white/10">
                <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-white">{heartbeat.workflow_name}</h2>
                      <Badge
                        className={
                          heartbeat.status === "silent"
                            ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
                            : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                        }
                      >
                        {heartbeat.status === "silent" ? "Silent" : "Running"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted-foreground)]">
                      <span>{formatFrequency(heartbeat.expected_frequency_hours)}</span>
                      <span>Last ping: {formatDistanceToNow(heartbeat.last_ping_at)}</span>
                      <span>Last alert: {formatDistanceToNow(heartbeat.last_alert_sent_at)}</span>
                    </div>
                  </div>

                  <Button asChild variant="secondary">
                    <Link href={`/setup/${heartbeat.manage_token}`}>
                      Manage
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
