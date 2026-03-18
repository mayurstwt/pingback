import { redirect } from "next/navigation";

import { verifyEmailToken } from "@/lib/users";

type VerifyPageProps = {
  searchParams: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { email, token } = await searchParams;

  if (!email || !token) {
    redirect("/auth/verification");
  }

  const user = await verifyEmailToken(email, token);

  if (!user) {
    redirect("/auth/verification");
  }

  redirect("/auth/login?message=verified");
}
