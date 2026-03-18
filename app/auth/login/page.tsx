import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthPageShell } from "@/components/auth-page-shell";
import { AuthStatusBanner, SignInForm } from "@/components/auth-form";

const authMessages: Record<string, string> = {
  "verify-email": "Check your inbox for a verification link before signing in.",
  verified: "Email verified. You can sign in now.",
  "password-reset": "Password updated. Sign in with your new password.",
};

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const { message } = await searchParams;

  if (session?.user?.email) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      eyebrow="Dashboard access"
      title="Sign in to load the heartbeats tied to your email."
      description="Use your verified Pingback account to access the dashboard for that email."
    >
      <div className="max-w-xl space-y-6">
        <AuthStatusBanner message={message ? authMessages[message] : undefined} />
        <SignInForm />
      </div>
    </AuthPageShell>
  );
}
