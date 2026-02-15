import { z } from "zod";

export const logInFormSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, { error: "Name must be at least 3 characters" }),
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string()
      .min(6, { error: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { error: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LogInFormValues = z.infer<typeof logInFormSchema>;
export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
