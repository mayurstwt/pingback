import crypto from "crypto";

export function generateToken(size = 24) {
  return crypto.randomBytes(size).toString("base64url");
}

export function generatePingKey() {
  return `hb_${generateToken(18)}`;
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function timingSafeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
