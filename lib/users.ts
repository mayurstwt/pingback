import bcrypt from "bcryptjs";

import { query } from "@/lib/db";
import { hashToken } from "@/lib/tokens";

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  email_verified_at: string | null;
  email_verification_token_hash: string | null;
  email_verification_expires_at: string | null;
  password_reset_token_hash: string | null;
  password_reset_expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getUserByEmail(email: string) {
  const result = await query<UserRow>("select * from users where email = $1 limit 1", [
    email.toLowerCase(),
  ]);

  return result.rows[0] ?? null;
}

export async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);

  const result = await query<UserRow>(
    `
      insert into users (email, password_hash, email_verified_at)
      values ($1, $2, null)
      returning *
    `,
    [email.toLowerCase(), passwordHash],
  );

  return result.rows[0];
}

export async function verifyUserPassword(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return null;
  }

  return user;
}

export async function storeEmailVerificationToken(email: string, token: string, expiresAt: Date) {
  const result = await query<UserRow>(
    `
      update users
      set email_verification_token_hash = $2,
          email_verification_expires_at = $3,
          updated_at = now()
      where email = $1
      returning *
    `,
    [email.toLowerCase(), hashToken(token), expiresAt.toISOString()],
  );

  return result.rows[0] ?? null;
}

export async function verifyEmailToken(email: string, token: string) {
  const result = await query<UserRow>(
    `
      update users
      set email_verified_at = now(),
          email_verification_token_hash = null,
          email_verification_expires_at = null,
          updated_at = now()
      where email = $1
        and email_verification_token_hash = $2
        and email_verification_expires_at is not null
        and email_verification_expires_at > now()
      returning *
    `,
    [email.toLowerCase(), hashToken(token)],
  );

  return result.rows[0] ?? null;
}

export async function storePasswordResetToken(email: string, token: string, expiresAt: Date) {
  const result = await query<UserRow>(
    `
      update users
      set password_reset_token_hash = $2,
          password_reset_expires_at = $3,
          updated_at = now()
      where email = $1
      returning *
    `,
    [email.toLowerCase(), hashToken(token), expiresAt.toISOString()],
  );

  return result.rows[0] ?? null;
}

export async function resetPasswordByToken(email: string, token: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);

  const result = await query<UserRow>(
    `
      update users
      set password_hash = $3,
          password_reset_token_hash = null,
          password_reset_expires_at = null,
          updated_at = now()
      where email = $1
        and password_reset_token_hash = $2
        and password_reset_expires_at is not null
        and password_reset_expires_at > now()
      returning *
    `,
    [email.toLowerCase(), hashToken(token), passwordHash],
  );

  return result.rows[0] ?? null;
}
