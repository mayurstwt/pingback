"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HeartbeatRow } from "@/lib/types";

type SetupFormProps = {
  heartbeat: HeartbeatRow;
};

export function SetupForm({ heartbeat }: SetupFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
          const response = await fetch(`/api/setup/${heartbeat.manage_token}`, {
            method: "POST",
            body: formData,
          });

          const payload = (await response.json()) as { error?: string; ok?: boolean };

          if (!response.ok) {
            setError(payload.error ?? "Unable to save heartbeat");
            return;
          }

          setSuccess("Heartbeat updated.");
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="workflowName">Workflow name</Label>
        <Input
          id="workflowName"
          name="workflowName"
          defaultValue={heartbeat.workflow_name}
          required
          placeholder="Lead form to CRM"
          aria-describedby="workflowName-help"
          aria-invalid={error ? true : undefined}
        />
        <p id="workflowName-help" className="text-xs leading-6 text-[var(--muted)]">
          Use the name you would recognize quickly during an outage.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Alert email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={heartbeat.email}
          required
          placeholder="founder@company.com"
          aria-describedby="email-help"
          aria-invalid={error ? true : undefined}
        />
        <p id="email-help" className="text-xs leading-6 text-[var(--muted)]">
          Alerts and dashboard access are tied to this address.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="expectedFrequencyHours">Expected ping frequency in hours</Label>
        <Input
          id="expectedFrequencyHours"
          name="expectedFrequencyHours"
          type="number"
          min={1}
          max={168}
          defaultValue={heartbeat.expected_frequency_hours}
          required
          aria-describedby="frequency-help"
          aria-invalid={error ? true : undefined}
        />
        <p id="frequency-help" className="text-xs leading-6 text-[var(--muted)]">
          Enter the largest acceptable gap between successful runs. Example: use `1` for an hourly workflow.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone number for future SMS</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          defaultValue={heartbeat.phone_number ?? ""}
          placeholder="+1 555 555 5555"
          aria-describedby="phone-help"
        />
        <p id="phone-help" className="text-xs leading-6 text-[var(--muted)]">
          Optional. Stored now so SMS alerts can be added later.
        </p>
      </div>
      {error ? (
        <p className="text-sm text-rose-300" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-emerald-300" role="status" aria-live="polite">
          {success}
        </p>
      ) : null}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save heartbeat"}
      </Button>
    </form>
  );
}
