import { z } from "zod";

export const setupHeartbeatSchema = z.object({
  email: z.string().email(),
  workflowName: z.string().min(2).max(120),
  expectedFrequencyHours: z.coerce.number().int().min(1).max(168),
  phoneNumber: z
    .string()
    .trim()
    .max(30)
    .optional()
    .transform((value) => value || ""),
});

export const dashboardSearchSchema = z.object({
  email: z.string().email(),
});
