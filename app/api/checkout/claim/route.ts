import { NextResponse } from "next/server";
import { z } from "zod";

import { createHeartbeat, getHeartbeatsByEmail, getSetupUrl } from "@/lib/heartbeats";
import { rateLimit } from "@/lib/rate-limit";

const claimSchema = z.object({
  checkoutId: z.string().min(2),
  email: z.string().email(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (!rateLimit(`claim:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute." },
      { status: 429 },
    );
  }

  const formData = await request.formData();
  const parsed = claimSchema.safeParse({
    checkoutId: formData.get("checkoutId"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout data" }, { status: 400 });
  }

  const existing = (await getHeartbeatsByEmail(parsed.data.email)).find(
    (heartbeat) => heartbeat.polar_checkout_id === parsed.data.checkoutId,
  );

  const heartbeat =
    existing ??
    (await createHeartbeat({
      email: parsed.data.email,
      workflowName: "New automation heartbeat",
      expectedFrequencyHours: 24,
      polarCheckoutId: parsed.data.checkoutId,
    }));

  return NextResponse.json({
    ok: true,
    manageUrl: `/setup/${heartbeat.manage_token}`,
    absoluteManageUrl: getSetupUrl(heartbeat.manage_token),
  });
}
