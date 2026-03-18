import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import {
  getMissedHeartbeats,
  markAlertSent,
  markHeartbeatSilent,
  shouldSendAlert,
} from "@/lib/heartbeats";
import { sendHeartbeatAlert } from "@/lib/mailer";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const missedHeartbeats = await getMissedHeartbeats();
  let alerted = 0;

  for (const heartbeat of missedHeartbeats) {
    await markHeartbeatSilent(heartbeat.id);

    if (!shouldSendAlert(heartbeat.last_alert_sent_at, heartbeat.expected_frequency_hours)) {
      continue;
    }

    try {
      await sendHeartbeatAlert(heartbeat);
      await markAlertSent(heartbeat.id);
      alerted += 1;
    } catch (err) {
      console.error(`[cron] Failed to alert for heartbeat ${heartbeat.id}:`, err);
    }
  }

  return NextResponse.json({
    ok: true,
    checked: missedHeartbeats.length,
    alerted,
  });
}
