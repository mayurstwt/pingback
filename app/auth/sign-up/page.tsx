import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthPageShell } from "@/components/auth-page-shell";
import { SignUpForm } from "@/components/auth-form";

export default async function SignUpPage() {
  const session = await auth();

  if (session?.user?.email) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      eyebrow="Create account"
      title="Create your Pingback login."
      description="Use the same email that should receive alerts and own the dashboard view."
    >
      <div className="max-w-xl">
        <SignUpForm />
      </div>
    </AuthPageShell>
  );
}
