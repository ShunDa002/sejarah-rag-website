"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SignUpForm } from "@/components/auth/AuthForms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm 
          onSuccess={() => router.push(callbackUrl)}
          switchToLogin={() => router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
        />
      </CardContent>
    </Card>
  );
}
