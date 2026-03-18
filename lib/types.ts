export type HeartbeatStatus = "running" | "silent";

export type HeartbeatRow = {
  id: string;
  email: string;
  workflow_name: string;
  expected_frequency_hours: number;
  phone_number: string | null;
  polar_checkout_id: string | null;
  ping_key: string;
  manage_token: string;
  last_ping_at: string | null;
  last_alert_sent_at: string | null;
  status: HeartbeatStatus;
  created_at: string;
  updated_at: string;
};
