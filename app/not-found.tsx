import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--primary)]">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Heartbeat not found</h1>
      <p className="mt-4 max-w-xl text-[var(--muted-foreground)]">
        The setup link may be invalid, expired, or already deleted.
      </p>
      <Button asChild className="mt-8">
        <Link href="/pricing">Create a new heartbeat</Link>
      </Button>
    </main>
  );
}
