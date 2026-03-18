import crypto from "crypto";

import { env } from "@/lib/env";

export function verifyPolarSignature(rawBody: string, signatureHeader: string | null) {
  if (!env.POLAR_WEBHOOK_SECRET || !signatureHeader) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", env.POLAR_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  const provided = signatureHeader.replace(/^sha256=/, "");

  if (expected.length !== provided.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}
