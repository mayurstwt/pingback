import { NextResponse } from "next/server";

import { deleteHeartbeat, updateHeartbeatByManageToken } from "@/lib/heartbeats";
import { sendSetupConfirmation } from "@/lib/mailer";
import { setupHeartbeatSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{
    manageToken: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { manageToken } = await context.params;
  const formData = await request.formData();

  const parsed = setupHeartbeatSchema.safeParse({
    email: formData.get("email"),
    workflowName: formData.get("workflowName"),
    expectedFrequencyHours: formData.get("expectedFrequencyHours"),
    phoneNumber: formData.get("phoneNumber"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const heartbeat = await updateHeartbeatByManageToken(manageToken, parsed.data);

  if (!heartbeat) {
    return NextResponse.json({ error: "Heartbeat not found" }, { status: 404 });
  }

  try {
    await sendSetupConfirmation(heartbeat);
  } catch (err) {
    console.warn("[setup] Failed to send confirmation email:", err);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, context: RouteContext) {
  const { manageToken } = await context.params;
  const deleted = await deleteHeartbeat(manageToken);

  if (!deleted) {
    return NextResponse.json({ error: "Heartbeat not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
