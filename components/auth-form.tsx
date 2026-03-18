"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { AuthActionState } from "@/app/auth/actions";
import {
  resendVerificationAction,
  signInAction,
  signUpAction,
} from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};
const successBannerClassName =
  "rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Working..." : label}
    </Button>
  );
}

function ActionMessage({ state }: { state: AuthActionState }) {
  if (state.error) {
    return (
      <p className="text-sm text-rose-300" role="alert" aria-live="polite">
        {state.error}
      </p>
    );
  }

  if (state.success) {
    return (
      <p className="text-sm text-emerald-300" role="status" aria-live="polite">
        {state.success}
      </p>
    );
  }

  return null;
}

function CredentialsCard({
  action,
  formKey,
  title,
  description,
  submitLabel,
}: {
  action: (_state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  formKey: string;
  title: string;
  description: string;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${formKey}-email`}>Email</Label>
            <Input
              id={`${formKey}-email`}
              name="email"
              type="email"
              placeholder="founder@company.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formKey}-password`}>Password</Label>
            <Input id={`${formKey}-password`} name="password" type="password" minLength={8} required />
          </div>
          <ActionMessage state={state} />
          <SubmitButton label={submitLabel} />
        </form>
      </CardContent>
    </Card>
  );
}

function EmailOnlyCard({
  action,
  formKey,
  title,
  description,
  submitLabel,
}: {
  action: (_state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  formKey: string;
  title: string;
  description: string;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${formKey}-email`}>Email</Label>
            <Input id={`${formKey}-email`} name="email" type="email" placeholder="founder@company.com" required />
          </div>
          <ActionMessage state={state} />
          <SubmitButton label={submitLabel} />
        </form>
      </CardContent>
    </Card>
  );
}

export function AuthStatusBanner({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <div className={successBannerClassName}>{message}</div>
  );
}

export function SignInForm() {
  return (
    <div className="space-y-4">
      <CredentialsCard
        action={signInAction}
        formKey="sign-in"
        title="Sign in"
        description="Use the email attached to your Pingback heartbeats."
        submitLabel="Sign in"
      />
      <div className="flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
        <Link href="/auth/sign-up" className="hover:text-white">
          Create account
        </Link>
        <Link href="/auth/forgot-password" className="hover:text-white">
          Forgot password
        </Link>
        <Link href="/auth/verification" className="hover:text-white">
          Resend verification
        </Link>
      </div>
    </div>
  );
}

export function SignUpForm() {
  return (
    <div className="space-y-4">
      <CredentialsCard
        action={signUpAction}
        formKey="sign-up"
        title="Create account"
        description="Simple email and password auth for now. Verify your email before signing in."
        submitLabel="Create account"
      />
      <p className="text-sm text-[var(--muted-foreground)]">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-white hover:text-[var(--primary)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export function ResendVerificationForm() {
  return (
    <div className="space-y-4">
      <EmailOnlyCard
        action={resendVerificationAction}
        formKey="resend-verification"
        title="Resend verification"
        description="Use this if you created an account but have not verified your email yet."
        submitLabel="Send verification email"
      />
      <p className="text-sm text-[var(--muted-foreground)]">
        Back to{" "}
        <Link href="/auth/login" className="text-white hover:text-[var(--primary)]">
          sign in
        </Link>
      </p>
    </div>
  );
}
