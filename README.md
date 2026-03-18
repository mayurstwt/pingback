# Pingback

Pingback keeps non-technical founders from losing leads by turning silent no-code automations into urgent alerts. It watches for heartbeat pings, stores their expected cadence, and emails the owner when a run goes missing.

## 1. Architecture & project map

- **`app/`**: Next.js App Router pages (`page.tsx`, `pricing/page.tsx`, `dashboard/page.tsx`, `setup/[manageToken]/page.tsx`, etc.) plus the API routes (`/api/ping/`, `/api/setup/`, `/api/checkout/claim`, `/api/polar/webhook`, `/api/cron/check-heartbeats`). Static pages are styled with the shared UI primitives.
- **`components/`**: UI atoms (`button`, `card`, `badge`, `input`, `label`, `separator`) and client helpers (`SetupForm`, `ClaimCheckoutForm`, search/delete buttons, copy ping button) that interop with the server routes.
- **`lib/`**: Core services and helpers:
  - `env.ts` validates every required runtime variable.
  - `db.ts` hides Postgres pooling/sharing.
  - `heartbeats.ts` owns heartbeat CRUD, ping recording, alert processing, URL helpers, and alert cooldown logic.
  - `mailer.ts` sends setup confirmations and missed-heartbeat emails via Nodemailer.
  - `polar.ts` verifies incoming Polar webhooks.
  - `validators.ts` keeps `zod` schemas for forms.
  - `tokens.ts` generates ping/manage keys plus timing-safe helpers.
  - `utils.ts` exposes layout helpers.
- **`supabase/schema.sql`**: `heartbeats` table definition, indexes, and `updated_at` trigger.
- **`.env.example`**: Blueprint for every env var. Copy to `.env.local` for dev.
- **`vercel.json`**: Declares the minute-by-minute cron hitting `/api/cron/check-heartbeats`.
- **`README.md`** (this file) explains setup, testing, and developer expectations; updates should remain in sync with `bible.md`.

## 2. Stack snapshot

- Next.js 15 App Router with typed routes.
- Tailwind CSS 4 + shadcn/ui cards/buttons with a dark, glassy theme (see `app/globals.css`).
- Postgres (Supabase recommended) via `pg`.
- Polar.sh checkout + webhook (no embedded payment UI).
- Nodemailer + Gmail SMTP (App Password recommended) for alerts.
- Vercel Cron for heartbeat scanning (`vercel.json`).
- Minimal runtime dependencies (`clsx`, `cva`, `lucide-react`, `zod`, `@radix-ui/react-*`).

## 3. Environment & DB setup

### Local

1. Copy `.env.example` to `.env.local`.
2. Populate key values:
   - `APP_URL=http://localhost:3000`
   - `DATABASE_URL`: point to a local Postgres running on `5432` (create user `postgres`/`postgres` or similar).
   - `CRON_SECRET`, `INTERNAL_API_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`.
   - `POLAR_CHECKOUT_URL`, `POLAR_WEBHOOK_SECRET`.
   - Optional: `EMAIL_ALERT_RECIPIENT_OVERRIDE` to route every email to a QA inbox.
3. Apply `supabase/schema.sql`:

   ```bash
   psql "$DATABASE_URL" -f supabase/schema.sql
   ```

### Production

1. Provision Postgres (Supabase, Neon, etc.), set `DATABASE_URL`.
2. Run the same SQL once: import `supabase/schema.sql`.
3. Propagate all environment variables from `.env.example` into your hosting provider. Keep secrets private.
4. Ensure `vercel.json` (or your host’s cron configuration) calls `/api/cron/check-heartbeats` every minute with `Authorization: Bearer <CRON_SECRET>`.

## 4. Payment & Polar integration

1. Host a Polar checkout link externally and store it in `POLAR_CHECKOUT_URL`.
2. Configure Polar’s success redirect for your domain: `https://<your-domain>/setup/claim`.
3. Set the webhook target to `https://<your-domain>/api/polar/webhook`.
4. `components/claim-checkout-form.tsx` POSTs `checkoutId` + `email` to `/api/checkout/claim` (validated via `lib/validators.ts`).
5. `/api/polar/webhook` uses `lib/polar.ts` to verify signatures, then `lib/heartbeats.ts` creates/reuses the heartbeat.
6. Polar metadata (`workflow_name`, `expected_frequency_hours`, `phone_number`) drives defaults in the heartbeat record.

## 5. SMTP & emails

- SMTP is configured entirely through env vars (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`).
- Gmail App Passwords are friendly with Nodemailer; ensure less-secure-apps is handled.
- `EMAIL_ALERT_RECIPIENT_OVERRIDE` will reroute every outbound message for safer dev testing.
- `lib/mailer.ts` exposes `sendSetupConfirmation` (used after `POST /api/setup/[manageToken]`) and `sendHeartbeatAlert` (used by the cron job).
- Alerts include the ping URL (`/api/ping/[pingKey]`) and the manage link (`/setup/[manageToken]`), so the owner can recover quickly.

## 6. Running the end-to-end loop

1. Customer pays via `POLAR_CHECKOUT_URL` and lands on `/setup/claim`.
2. The claim form captures the checkout/order ID and an email, then returns `manageUrl`.
3. `/setup/[manageToken]/` surfaces the ping endpoint, current status, and editable settings.
4. The automation pings `/api/ping/[pingKey]` (GET or POST) whenever it runs.
5. Vercel Cron fires `/api/cron/check-heartbeats` each minute with `Authorization: Bearer <CRON_SECRET>`.
6. If a heartbeat is stale, the cron job marks it silent, sends `sendHeartbeatAlert`, and updates `last_alert_sent_at`.
7. When the webhook runs again, `recordPing` sets `status = running` and refreshes the timestamp.

## 7. Testing & verification

### 7.1 Static & Build checks
Ensure the code is structurally sound and follows conventions:
- **Linting**: `npm run lint` (Checks for style and basic errors)
- **Type Checking**: `npm run typecheck` (Verifies all TypeScript types across routes and components)
- **Production Build**: `npm run build` (Ensures the app can be compiled for production)

### 7.2 Database & Connectivity
- **Schema**: Run `psql "$DATABASE_URL" -f supabase/schema.sql` and verify the `users` and `heartbeats` tables exist.
- **Environment**: Ensure `.env.local` is fully populated; the app will fail fast via `lib/env.ts` if keys are missing.

### 7.3 User Authentication Flow
1. **Sign Up**: Visit `/auth/sign-up`, create an account. Check your SMTP inbox (or override) for the verification email.
2. **Verification**: Click the link in the email to verify. Ensure you are redirected to login.
3. **Login**: Sign in with your credentials. Verify you are redirected to the Dashboard.
4. **Password Reset**: Use the "Forgot Password" flow at `/auth/forgot-password` and verify the reset email/link works.

### 7.4 Heartbeat Lifecycle (End-to-End)
1. **Mock Checkout**: 
   - Visit `http://localhost:3000/setup/claim`.
   - Submit a mock `checkoutId` (e.g., `test_123`) and your `email`.
   - Ensure it returns a `manageUrl` (e.g., `/setup/hb_...`).
2. **Setup & Configuration**:
   - Navigate to the returned `manageUrl`.
   - Update the "Workflow Name" and "Expected Frequency".
   - Submit and verify the "Saved!" confirmation appears.
3. **Recording Pings**:
   - Copy the "Ping URL" from the setup page.
   - Run a `curl` command: `curl -X GET http://localhost:3000/api/ping/hb_...`.
   - Expect `{"ok":true,"received_at":...}` and verify the "Last Ping" timestamp on the setup page updates.
4. **Triggering Alerts (Cron)**:
   - Manually set the `last_ping_at` in the database to be older than the frequency (e.g., 2 days ago).
   - Run the cron job: `curl -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/cron/check-heartbeats`.
   - Verify:
     - The status in the DB/UI changes to `silent`.
     - An alert email is sent to the owner.
     - `last_alert_sent_at` is updated.
5. **Recovery**:
   - Ping the heartbeat again via `curl`.
   - Verify the status returns to `running` automatically.

### 7.5 Dashboard & Management
1. **Visibility**: Ensure all heartbeats created with your email appear on the `/dashboard`.
2. **Navigation**: Verify the "Manage" button on the dashboard correctly routes to the specific setup page.
3. **Deletion**: Delete a heartbeat from the setup page and verify it no longer appears in the dashboard or database.

### 7.6 Email & SMTP
- **Override Testing**: Set `EMAIL_ALERT_RECIPIENT_OVERRIDE` to your own email to safely test production-like alerts without bothering real users.
- **Logs**: Monitor terminal logs when sending emails; `lib/mailer.ts` will report transporter errors.

### 7.7 Testing with Real Automations (Zapier/Make)
To verify Pingback works with your actual workflows:

1. **Zapier**:
   - Add a **"Webhooks by Zapier"** step at the very end of your Zap.
   - Select the **"GET"** or **"POST"** event.
   - Paste your Ping URL (e.g., `https://pingback.app/api/ping/hb_...`) into the URL field.
   - Click "Test step" in Zapier and verify the "Last Ping" updates in your Pingback dashboard.

2. **Make (formerly Integromat)**:
   - Add an **"HTTP"** module with the **"Make a request"** action.
   - Set the URL to your Ping URL.
   - Set the Method to **"GET"**.
   - Run the module once and confirm the Pingback status turns "Running" (emerald badge).

3. **GoHighLevel / Custom Webhooks**:
   - Use a "Webhook" action in your Workflow builder.
   - Select **"POST"** and paste the Ping URL.
   - Trigger the workflow (e.g., by submitting a test lead) and ensure Pingback receives the hit.

4. **GitHub Actions / Code**:
   - Add a step: `run: curl -s https://pingback.app/api/ping/hb_your_key`
   - This ensures your CI/CD pipelines are also being monitored for "silent" failures.

## 8. Developer guidelines

- Keep new UI components in `components/`, follow PascalCase naming, and default to server components unless state/event handling is required.
- File names are kebab-case (e.g., `api/ping/route.ts`, `setup/[manageToken]/page.tsx`).
- Persisted data lives in snake_case tables/columns (`heartbeats`, `expected_frequency_hours`).
- Favor `zod` validation (`lib/validators.ts`) before touching the database.
- Avoid new dependencies unless they solve a clear UX or server need; the goal is to stay lean.
- When adding server logic, rerun `npm run typecheck` and `npm run build` because typed routes surface typing issues at build time.
- Document new APIs/routes in this README and update `bible.md` if you pivot from the original product constraints.

## 9. Troubleshooting & next steps

- Cron jobs must send the bearer header; the route rejects any unauthorized requests.
- Use `EMAIL_ALERT_RECIPIENT_OVERRIDE` when SMTP is unreliable, and monitor the transporter logs that `nodemailer` prints.
- Any new cron or API route should live under `app/api/` and follow the typed route conventions.
- Future improvements could add SMS alerts, per-user dashboards, or authenticated user accounts, but keep the MVP loop (payment → setup → ping → alert) intact before expanding.
