import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-sm font-medium text-[var(--primary)]",
        className,
      )}
      {...props}
    />
  );
}
