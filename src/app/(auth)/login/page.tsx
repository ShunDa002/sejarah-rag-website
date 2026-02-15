"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/AuthForms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm 
          onSuccess={() => router.push(callbackUrl)}
          switchToSignUp={() => router.push(`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`)}
        />
      </CardContent>
    </Card>
  );
}
