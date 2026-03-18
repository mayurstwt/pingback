import { query } from "@/lib/db";
import { env } from "@/lib/env";
import { generatePingKey, generateToken } from "@/lib/tokens";
import type { HeartbeatRow } from "@/lib/types";

type CreateHeartbeatInput = {
  email: string;
  workflowName: string;
  expectedFrequencyHours: number;
  phoneNumber?: string | null;
  polarCheckoutId?: string | null;
};

export async function createHeartbeat(input: CreateHeartbeatInput) {
  const result = await query<HeartbeatRow>(
    `
      insert into heartbeats (
        email,
        workflow_name,
        expected_frequency_hours,
        phone_number,
        ping_key,
        manage_token,
        polar_checkout_id
      )
      values ($1, $2, $3, $4, $5, $6, $7)
      returning *
    `,
    [
      input.email.toLowerCase(),
      input.workflowName,
      input.expectedFrequencyHours,
      input.phoneNumber ?? null,
      generatePingKey(),
      generateToken(),
      input.polarCheckoutId ?? null,
    ],
  );

  return result.rows[0];
}

export async function updateHeartbeatByManageToken(
  manageToken: string,
  input: Pick<CreateHeartbeatInput, "email" | "workflowName" | "expectedFrequencyHours" | "phoneNumber">,
) {
  const result = await query<HeartbeatRow>(
    `
      update heartbeats
      set email = $2,
          workflow_name = $3,
          expected_frequency_hours = $4,
          phone_number = $5,
          updated_at = now()
      where manage_token = $1
      returning *
    `,
    [
      manageToken,
      input.email.toLowerCase(),
      input.workflowName,
      input.expectedFrequencyHours,
      input.phoneNumber ?? null,
    ],
  );

  return result.rows[0] ?? null;
}

export async function getHeartbeatByManageToken(manageToken: string) {
  const result = await query<HeartbeatRow>(
    "select * from heartbeats where manage_token = $1 limit 1",
    [manageToken],
  );

  return result.rows[0] ?? null;
}

export async function getHeartbeatByPingKey(pingKey: string) {
  const result = await query<HeartbeatRow>(
    "select * from heartbeats where ping_key = $1 limit 1",
    [pingKey],
  );

  return result.rows[0] ?? null;
}

export async function getHeartbeatsByEmail(email: string) {
  const result = await query<HeartbeatRow>(
    "select * from heartbeats where email = $1 order by created_at desc",
    [email.toLowerCase()],
  );

  return result.rows;
}

export async function recordPing(pingKey: string) {
  const result = await query<HeartbeatRow>(
    `
      update heartbeats
      set last_ping_at = now(),
          status = 'running',
          updated_at = now()
      where ping_key = $1
      returning *
    `,
    [pingKey],
  );

  return result.rows[0] ?? null;
}

export async function deleteHeartbeat(manageToken: string) {
  const result = await query<{ id: string }>(
    "delete from heartbeats where manage_token = $1 returning id",
    [manageToken],
  );

  return (result.rowCount ?? 0) > 0;
}

export async function getMissedHeartbeats() {
  const result = await query<HeartbeatRow>(
    `
      select *
      from heartbeats
      where (
        last_ping_at is null
        and created_at < now() - make_interval(hours => expected_frequency_hours)
      )
      or (
        last_ping_at is not null
        and last_ping_at < now() - make_interval(hours => expected_frequency_hours)
      )
      order by created_at asc
    `,
  );

  return result.rows;
}

export async function markHeartbeatSilent(id: string) {
  await query(
    `
      update heartbeats
      set status = 'silent',
          updated_at = now()
      where id = $1
    `,
    [id],
  );
}

export async function markAlertSent(id: string) {
  await query(
    `
      update heartbeats
      set last_alert_sent_at = now(),
          updated_at = now()
      where id = $1
    `,
    [id],
  );
}

export function getPingUrl(pingKey: string) {
  return `${env.APP_URL}/api/ping/${pingKey}`;
}

export function getSetupUrl(manageToken: string) {
  return `${env.APP_URL}/setup/${manageToken}`;
}

export function shouldSendAlert(lastAlertSentAt: string | null, expectedFrequencyHours: number) {
  if (!lastAlertSentAt) {
    return true;
  }

  const thresholdMs = Math.max(expectedFrequencyHours * 60 * 60 * 1000, 60 * 60 * 1000);
  return Date.now() - new Date(lastAlertSentAt).getTime() > thresholdMs;
}
