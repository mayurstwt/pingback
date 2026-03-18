"use client"
import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ClaimCheckoutForm() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [checkoutId, setCheckoutId] = useState("");

  useEffect(() => {
    const id = searchParams.get("checkout_id");
    if (id) {
      setCheckoutId(id);
    }
  }, [searchParams]);

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
          const response = await fetch("/api/checkout/claim", {
            method: "POST",
            body: formData,
          });
          const payload = (await response.json()) as {
            error?: string;
            manageUrl?: string;
          };

          if (!response.ok || !payload.manageUrl) {
            setError(payload.error ?? "Unable to create a setup link");
            return;
          }

          window.location.href = payload.manageUrl;
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="checkoutId">Polar checkout or order ID</Label>
        <Input
          id="checkoutId"
          name="checkoutId"
          required
          placeholder="ord_123 or checkout_123"
          value={checkoutId}
          onChange={(e) => setCheckoutId(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Purchaser email</Label>
        <Input id="email" name="email" type="email" required placeholder="founder@company.com" />
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Continue to setup"}
      </Button>
    </form>
  );
}
