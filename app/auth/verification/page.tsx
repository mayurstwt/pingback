import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthPageShell } from "@/components/auth-page-shell";
import { ResendVerificationForm } from "@/components/auth-form";

type VerificationPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function VerificationPage({ searchParams }: VerificationPageProps) {
  const session = await auth();
  const { message } = await searchParams;

  if (session?.user?.email) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      eyebrow="Email verification"
      title="Resend your verification email."
      description="Use this page if you signed up but have not confirmed ownership of the email yet."
    >
      <div className="max-w-xl space-y-6">
        {message === "verify-email" ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            Check your inbox for a verification link.
          </div>
        ) : null}
        <ResendVerificationForm />
      </div>
    </AuthPageShell>
  );
}
