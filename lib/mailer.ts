import nodemailer from "nodemailer";

import { env } from "@/lib/env";
import { getPingUrl, getSetupUrl } from "@/lib/heartbeats";
import type { HeartbeatRow } from "@/lib/types";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

function resolveRecipient(email: string) {
  return env.EMAIL_ALERT_RECIPIENT_OVERRIDE ?? email;
}

export async function sendHeartbeatAlert(heartbeat: HeartbeatRow) {
  const pingUrl = getPingUrl(heartbeat.ping_key);
  const setupUrl = getSetupUrl(heartbeat.manage_token);

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: resolveRecipient(heartbeat.email),
    subject: `Pingback alert: ${heartbeat.workflow_name} is silent`,
    text: [
      `Your workflow "${heartbeat.workflow_name}" missed its expected heartbeat.`,
      "",
      `Expected frequency: every ${heartbeat.expected_frequency_hours} hour(s)`,
      `Last ping: ${heartbeat.last_ping_at ?? "No ping received yet"}`,
      "",
      `Ping URL: ${pingUrl}`,
      `Manage heartbeat: ${setupUrl}`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#101828;line-height:1.6">
        <h2 style="margin-bottom:12px">Pingback alert</h2>
        <p>Your workflow <strong>${heartbeat.workflow_name}</strong> missed its expected heartbeat.</p>
        <p><strong>Expected frequency:</strong> every ${heartbeat.expected_frequency_hours} hour(s)<br />
        <strong>Last ping:</strong> ${heartbeat.last_ping_at ?? "No ping received yet"}</p>
        <p><a href="${setupUrl}">Manage this heartbeat</a></p>
        <p style="font-size:14px;color:#475467">Ping URL: ${pingUrl}</p>
      </div>
    `,
  });
}

export async function sendSetupConfirmation(heartbeat: HeartbeatRow) {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: resolveRecipient(heartbeat.email),
    subject: `Pingback setup: ${heartbeat.workflow_name}`,
    text: [
      `Your heartbeat for "${heartbeat.workflow_name}" is ready.`,
      "",
      `Ping URL: ${getPingUrl(heartbeat.ping_key)}`,
      `Manage heartbeat: ${getSetupUrl(heartbeat.manage_token)}`,
    ].join("\n"),
  });
}

export async function sendVerificationEmail(email: string, verificationUrl: string) {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: resolveRecipient(email),
    subject: "Verify your Pingback account",
    text: [
      "Verify your email to unlock your Pingback dashboard.",
      "",
      `Verification link: ${verificationUrl}`,
      "",
      "This link expires in 24 hours.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#101828;line-height:1.6">
        <h2 style="margin-bottom:12px">Verify your Pingback account</h2>
        <p>Verify your email to unlock your Pingback dashboard.</p>
        <p><a href="${verificationUrl}">Verify email</a></p>
        <p style="font-size:14px;color:#475467">This link expires in 24 hours.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: resolveRecipient(email),
    subject: "Reset your Pingback password",
    text: [
      "We received a request to reset your Pingback password.",
      "",
      `Reset link: ${resetUrl}`,
      "",
      "This link expires in 1 hour.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#101828;line-height:1.6">
        <h2 style="margin-bottom:12px">Reset your Pingback password</h2>
        <p>We received a request to reset your Pingback password.</p>
        <p><a href="${resetUrl}">Reset password</a></p>
        <p style="font-size:14px;color:#475467">This link expires in 1 hour.</p>
      </div>
    `,
  });
}
