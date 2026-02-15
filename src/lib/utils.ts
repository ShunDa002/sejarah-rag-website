import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatErrors(error: any): string {
  if (error instanceof ZodError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error as any).errors.map((e: any) => e.message).join(". ");
  }

  if (error?.code === "P2002") {
    const target = error.meta?.target;
    if (Array.isArray(target) && target.includes("email")) {
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
