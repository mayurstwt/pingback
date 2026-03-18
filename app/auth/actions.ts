"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import type { DatabaseError } from "pg";
import { z } from "zod";

import { signIn, signOut } from "@/auth";
import { enforceAuthRateLimit } from "@/lib/auth-rate-limit";
import { env } from "@/lib/env";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mailer";
import { generateToken } from "@/lib/tokens";
import {
  createUser,
  getUserByEmail,
  resetPasswordByToken,
  storeEmailVerificationToken,
  storePasswordResetToken,
} from "@/lib/users";

const authFormSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

const resetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email address."),
    token: z.string().min(1, "Invalid reset link."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type AuthActionState = {
  error?: string;
  success?: string;
};

const SIGN_IN_WINDOW_MS = 15 * 60 * 1000;
const SIGN_UP_WINDOW_MS = 60 * 60 * 1000;
const RESET_WINDOW_MS = 60 * 60 * 1000;

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && (error as DatabaseError).code === "23505";
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsedData = authFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Unable to sign in.",
    };
  }

  const user = await getUserByEmail(parsedData.data.email);

  if (!user) {
    return {
      error: "Incorrect email or password.",
    };
  }

  const allowed = await enforceAuthRateLimit("sign-in", parsedData.data.email, {
    perIpLimit: 10,
    perEmailLimit: 5,
    windowMs: SIGN_IN_WINDOW_MS,
  });

  if (!allowed) {
    return {
      error: "Too many sign-in attempts. Try again in a few minutes.",
    };
  }

  if (!user.email_verified_at) {
    return {
      error: "Verify your email before signing in.",
    };
  }

  try {
    await signIn("credentials", {
      email: parsedData.data.email,
      password: parsedData.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Incorrect email or password.",
      };
    }

    throw error;
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsedData = authFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Unable to create account.",
    };
  }

  const allowed = await enforceAuthRateLimit("sign-up", parsedData.data.email, {
    perIpLimit: 5,
    perEmailLimit: 3,
    windowMs: SIGN_UP_WINDOW_MS,
  });

  if (!allowed) {
    return {
      error: "Too many signup attempts. Try again later.",
    };
  }

  const existingUser = await getUserByEmail(parsedData.data.email);

  if (existingUser) {
    return {
      error: existingUser.email_verified_at
        ? "An account already exists for this email."
        : "Account exists but is not verified yet. Request a new verification email below.",
    };
  }

  try {
    await createUser(parsedData.data.email, parsedData.data.password);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        error: "An account already exists for this email.",
      };
    }

    throw error;
  }

  const token = generateToken(24);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await storeEmailVerificationToken(parsedData.data.email, token, expiresAt);

  await sendVerificationEmail(
    parsedData.data.email,
    `${env.APP_URL}/auth/verify?email=${encodeURIComponent(parsedData.data.email)}&token=${encodeURIComponent(token)}`,
  );

  redirect("/auth/verification?message=verify-email");
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/auth/login",
  });
}

export async function resendVerificationAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsedData = emailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Unable to resend verification email.",
    };
  }

  const allowed = await enforceAuthRateLimit("resend-verification", parsedData.data.email, {
    perIpLimit: 5,
    perEmailLimit: 3,
    windowMs: SIGN_UP_WINDOW_MS,
  });

  if (!allowed) {
    return {
      error: "Too many verification email requests. Try again later.",
    };
  }

  const user = await getUserByEmail(parsedData.data.email);

  if (!user) {
    return {
      success: "If an account exists, a verification email has been sent.",
    };
  }

  if (user.email_verified_at) {
    return {
      success: "This account is already verified. You can sign in now.",
    };
  }

  const token = generateToken(24);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await storeEmailVerificationToken(parsedData.data.email, token, expiresAt);

  await sendVerificationEmail(
    parsedData.data.email,
    `${env.APP_URL}/auth/verify?email=${encodeURIComponent(parsedData.data.email)}&token=${encodeURIComponent(token)}`,
  );

  return {
    success: "Verification email sent.",
  };
}

export async function requestPasswordResetAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsedData = emailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Unable to request password reset.",
    };
  }

  const allowed = await enforceAuthRateLimit("password-reset-request", parsedData.data.email, {
    perIpLimit: 5,
    perEmailLimit: 3,
    windowMs: RESET_WINDOW_MS,
  });

  if (!allowed) {
    return {
      error: "Too many reset requests. Try again later.",
    };
  }

  const user = await getUserByEmail(parsedData.data.email);

  if (user?.email_verified_at) {
    const token = generateToken(24);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await storePasswordResetToken(parsedData.data.email, token, expiresAt);
    await sendPasswordResetEmail(
      parsedData.data.email,
      `${env.APP_URL}/auth/reset-password?email=${encodeURIComponent(parsedData.data.email)}&token=${encodeURIComponent(token)}`,
    );
  }

  return {
    success: "If that account exists, a password reset link has been sent.",
  };
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsedData = resetPasswordSchema.safeParse({
    email: formData.get("email"),
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsedData.success) {
    return {
      error: parsedData.error.issues[0]?.message ?? "Unable to reset password.",
    };
  }

  const allowed = await enforceAuthRateLimit("password-reset-complete", parsedData.data.email, {
    perIpLimit: 10,
    perEmailLimit: 5,
    windowMs: RESET_WINDOW_MS,
  });

  if (!allowed) {
    return {
      error: "Too many reset attempts. Try again later.",
    };
  }

  const user = await resetPasswordByToken(
    parsedData.data.email,
    parsedData.data.token,
    parsedData.data.password,
  );

  if (!user) {
    return {
      error: "This reset link is invalid or has expired.",
    };
  }

  redirect("/auth/login?message=password-reset");
}
