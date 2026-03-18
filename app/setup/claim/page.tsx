import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ClaimCheckoutForm } from "@/components/claim-checkout-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClaimCheckoutPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-90rem items-center px-6 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="glass w-full border-white/10">
          <CardHeader>
            <Button asChild variant="ghost" className="-ml-4 w-fit">
              <Link href="/pricing">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to pricing
              </Link>
            </Button>
            <CardTitle>Claim your setup link</CardTitle>
            <CardDescription>
              After Polar redirects back, Paste the checkout identifier and your email to create or
              recover the private setup page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-40 animate-pulse bg-white/5" />}>
              <ClaimCheckoutForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}