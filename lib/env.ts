import { z } from "zod";

const envSchema = z.object({
  APP_URL: z.string().url().default("http://localhost:3000"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),
  INTERNAL_API_SECRET: z.string().min(1, "INTERNAL_API_SECRET is required"),
  EMAIL_FROM: z.string().email("EMAIL_FROM must be a valid email"),
  EMAIL_ALERT_RECIPIENT_OVERRIDE: z.string().email().optional(),
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
  POLAR_CHECKOUT_URL: z.string().url().optional(),
  POLAR_WEBHOOK_SECRET: z.string().optional(),
});

export const env = envSchema.parse({
  APP_URL: process.env.APP_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  CRON_SECRET: process.env.CRON_SECRET,
  INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_ALERT_RECIPIENT_OVERRIDE: process.env.EMAIL_ALERT_RECIPIENT_OVERRIDE,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  POLAR_CHECKOUT_URL: process.env.POLAR_CHECKOUT_URL,
  POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
});
