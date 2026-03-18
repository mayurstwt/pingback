import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthPageShell } from "@/components/auth-page-shell";
import { PasswordResetRequestForm } from "@/components/reset-password-form";

export default async function ForgotPasswordPage() {
  const session = await auth();

  if (session?.user?.email) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      eyebrow="Forgot password"
      title="Request a password reset email."
      description="We will email a reset link to verified accounts only."
    >
      <div className="max-w-xl">
        <PasswordResetRequestForm />
      </div>
    </AuthPageShell>
  );
}
