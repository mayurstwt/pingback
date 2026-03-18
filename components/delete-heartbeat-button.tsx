"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DeleteHeartbeatButtonProps = {
  manageToken: string;
};

export function DeleteHeartbeatButton({ manageToken }: DeleteHeartbeatButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="destructive" disabled={isPending}>
            Delete heartbeat
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this heartbeat?</DialogTitle>
            <DialogDescription>
              This removes the monitor and its dashboard entry. You will stop receiving alerts for it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isPending}>
                Keep heartbeat
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  setError(null);

                  const response = await fetch(`/api/setup/${manageToken}`, {
                    method: "DELETE",
                  });

                  if (!response.ok) {
                    const payload = (await response.json()) as { error?: string };
                    setError(payload.error ?? "Delete failed");
                    return;
                  }

                  setOpen(false);
                  router.push("/dashboard");
                  router.refresh();
                });
              }}
            >
              {isPending ? "Deleting..." : "Confirm delete"}
            </Button>
          </DialogFooter>
          {error ? (
            <p className="mt-3 text-sm text-rose-300" role="alert" aria-live="polite">
              {error}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
