import { headers } from "next/headers";

import { rateLimit } from "@/lib/rate-limit";

async function getClientIp() {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return headerStore.get("x-real-ip") ?? "unknown";
}

export async function enforceAuthRateLimit(
  action: string,
  email: string,
  options: {
    perIpLimit: number;
    perEmailLimit: number;
    windowMs: number;
  },
) {
  const normalizedEmail = email.toLowerCase();
  const clientIp = await getClientIp();

  const ipAllowed = rateLimit(`auth:${action}:ip:${clientIp}`, options.perIpLimit, options.windowMs);
  const emailAllowed = rateLimit(
    `auth:${action}:email:${normalizedEmail}`,
    options.perEmailLimit,
    options.windowMs,
  );

  return ipAllowed && emailAllowed;
}
