import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatErrors(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues.map((e) => e.message).join(". ");
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  ) {
    const meta =
      "meta" in error
        ? (error as { meta?: { target?: string[] } }).meta
        : undefined;
    if (Array.isArray(meta?.target) && meta.target.includes("email")) {
      return "Email already exists";
    }
    return "Unique constraint violation";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return JSON.stringify(error);
}
