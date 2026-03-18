"use client";

import { useActionState } from "react";

import type { AuthActionState } from "@/app/auth/actions";
import { requestPasswordResetAction, resetPasswordAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

function Message({ state }: { state: AuthActionState }) {
  if (state.error) {
    return <p className="text-sm text-rose-300">{state.error}</p>;
  }

  if (state.success) {
    return <p className="text-sm text-emerald-300">{state.success}</p>;
  }

  return null;
}

export function PasswordResetRequestForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle>Request reset link</CardTitle>
        <CardDescription>Enter the email for your verified Pingback account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-request-email">Email</Label>
            <Input
              id="reset-request-email"
              name="email"
              type="email"
              placeholder="founder@company.com"
              required
            />
          </div>
          <Message state={state} />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function PasswordResetForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle>Set new password</CardTitle>
        <CardDescription>Choose a new password for {email}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="token" value={token} />
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input id="new-password" name="password" type="password" minLength={8} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirm password</Label>
            <Input
              id="confirm-new-password"
              name="confirmPassword"
              type="password"
              minLength={8}
              required
            />
          </div>
          <Message state={state} />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Updating..." : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
