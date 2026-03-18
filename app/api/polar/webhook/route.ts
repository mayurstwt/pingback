import { NextResponse } from "next/server";

import { createHeartbeat, getHeartbeatsByEmail } from "@/lib/heartbeats";
import { verifyPolarSignature } from "@/lib/polar";

type PolarPayload = {
  type?: string;
  data?: {
    id?: string;
    customer_email?: string;
    email?: string;
    metadata?: {
      workflow_name?: string;
      expected_frequency_hours?: number | string;
      phone_number?: string;
    };
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("polar-signature") ?? request.headers.get("x-polar-signature");

  if (!verifyPolarSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as PolarPayload;

  if (!payload.data?.id) {
    return NextResponse.json({ error: "Missing payload data" }, { status: 400 });
  }

  const email = payload.data.customer_email ?? payload.data.email;

  if (!email) {
    return NextResponse.json({ error: "Missing customer email" }, { status: 400 });
  }

  const existing = (await getHeartbeatsByEmail(email)).find(
    (heartbeat) => heartbeat.polar_checkout_id === payload.data?.id,
  );

  if (!existing) {
    await createHeartbeat({
      email,
      workflowName: payload.data.metadata?.workflow_name ?? "New automation heartbeat",
      expectedFrequencyHours: Number(payload.data.metadata?.expected_frequency_hours ?? 24),
      phoneNumber: payload.data.metadata?.phone_number ?? null,
      polarCheckoutId: payload.data.id,
    });
  }

  return NextResponse.json({ ok: true });
}
