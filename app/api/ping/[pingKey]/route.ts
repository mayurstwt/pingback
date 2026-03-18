import { NextResponse } from "next/server";

import { recordPing } from "@/lib/heartbeats";
import { rateLimit } from "@/lib/rate-limit";

type RouteContext = {
  params: Promise<{
    pingKey: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { pingKey } = await context.params;

  if (!rateLimit(`ping:${pingKey}`, 1, 30_000)) {
    return NextResponse.json(
      { error: "Too many pings. Try again in 30 seconds." },
      { status: 429 },
    );
  }

  const heartbeat = await recordPing(pingKey);

  if (!heartbeat) {
    return NextResponse.json({ error: "Heartbeat not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    message: "Heartbeat recorded",
    workflowName: heartbeat.workflow_name,
    lastPingAt: heartbeat.last_ping_at,
  });
}

export const POST = GET;
