import Link from "next/link";

import { PasswordResetForm, PasswordResetRequestForm } from "@/components/reset-password-form";
import { Button } from "@/components/ui/button";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { email, token } = await searchParams;
  const showResetForm = Boolean(email && token);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-90rem items-center px-6 py-10 sm:px-8">
      <section className="w-full space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--primary)]">Password reset</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {showResetForm ? "Choose a new password." : "Request a password reset email."}
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            {showResetForm
              ? "This reset link is single-use and expires after one hour."
              : "We will email a reset link to verified accounts only."}
          </p>
        </div>

        {showResetForm ? (
          <PasswordResetForm email={email!} token={token!} />
        ) : (
          <PasswordResetRequestForm />
        )}

        <Button asChild variant="ghost">
          <Link href="/auth/login">Back to sign in</Link>
        </Button>
      </section>
    </main>
  );
}
