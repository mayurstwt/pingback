"use client";

import { useState, useTransition } from "react";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

type CopyPingUrlButtonProps = {
  pingUrl: string;
};

export function CopyPingUrlButton({ pingUrl }: CopyPingUrlButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await navigator.clipboard.writeText(pingUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          });
        }}
      >
        <Copy className="mr-2 h-4 w-4" />
        {copied ? "Copied" : "Copy URL"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Ping URL copied to clipboard." : ""}
      </span>
    </>
  );
}
