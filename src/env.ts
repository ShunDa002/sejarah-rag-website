import { z } from "zod";

/**
 * Server-side environment variables schema.
 * These are validated at runtime when the module is first imported.
 * If any required variable is missing, the app will crash immediately
 * with a clear error message instead of failing silently later.
 */
const envSchema = z.object({
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid URL"),
  RAG_API_URL: z
    .string()
    .url("RAG_API_URL must be a valid URL")
    .default("http://127.0.0.1:8000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
