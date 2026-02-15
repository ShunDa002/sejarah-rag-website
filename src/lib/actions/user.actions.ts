"use server";

import { z } from "zod";
import { hashSync } from "bcrypt-ts-edge";
import { signIn } from "@/auth";
import { signUpFormSchema } from "@/lib/validators";
import { formatErrors } from "@/lib/utils";
import { db } from "@/lib/prisma";

export async function signUpUser(values: z.infer<typeof signUpFormSchema>) {
  try {
    const validatedFields = signUpFormSchema.parse(values);
    const { email, password, name } = validatedFields;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email already exists" };
    }

    const hashedPassword = hashSync(password, 10);

    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: formatErrors(error) };
  }
}

export async function signInWithCredentials(
  values: z.infer<typeof signUpFormSchema>,
) {
  // This is handled by auth.ts authorize callback, but we might expose a wrapper if needed.
  // For now, we use the signIn function directly in the UI component or specific action wrappers.
  return;
}

export async function signInWithGoogle(callbackUrl?: string) {
  await signIn("google", { redirectTo: callbackUrl || "/" });
}
