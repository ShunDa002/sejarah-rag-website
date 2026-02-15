"use client";

import { useState, useRef, useEffect } from "react";

import { useSession, signOut } from "next-auth/react";

import { LogOut } from "lucide-react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { LoginForm, SignUpForm } from "@/components/auth/AuthForms";

import { cn } from "@/lib/utils";

export function HeaderAuth() {
  const { data: session, status } = useSession();

  const [authView, setAuthView] = useState<"login" | "signup">("login");

  const [isOpen, setIsOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Close dropdown when clicking outside

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // If session is loading, we might show nothing or a spinner.

  if (status === "loading") return null;

  if (session?.user) {
    const userInitials = session.user.name
      ? session.user.name

          .split(" ")

          .map((n) => n[0])

          .join("")

          .toUpperCase()

          .substring(0, 2)
      : session.user.email?.[0].toUpperCase() || "U";

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted hover:bg-muted/80 transition-colors overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium">{userInitials}</span>
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 z-50">
            <div className="px-2 py-1.5 text-sm font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user.name}
                </p>

                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </div>

            <div className="-mx-1 my-1 h-px bg-muted" />

            <button
              onClick={() => {
                setIsDropdownOpen(false);

                signOut();
              }}
              className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />

              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAuthView("login")}
          >
            Log In
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button size="sm" onClick={() => setAuthView("signup")}>
            Sign Up
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {authView === "login" ? "Welcome Back" : "Create an Account"}
          </DialogTitle>
          <DialogDescription>
            {authView === "login"
              ? "Enter your credentials to access your chat history."
              : "Enter your details to create a new account."}
          </DialogDescription>
        </DialogHeader>

        {authView === "login" ? (
          <LoginForm
            onSuccess={() => setIsOpen(false)}
            switchToSignUp={() => setAuthView("signup")}
          />
        ) : (
          <SignUpForm
            onSuccess={() => setIsOpen(false)}
            switchToLogin={() => setAuthView("login")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
