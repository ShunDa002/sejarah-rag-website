"use client";

import { useState, useCallback, useEffect } from "react";
import { Menu, Plus, Book } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { ChatHistory } from "./ChatHistory";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";

import { useRouter } from "next/navigation";

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { createNewChat } = useChat();
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setExpanded(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setExpanded((prev) => !prev);
    }
  }, [isMobile]);

  const handleNewChat = useCallback(() => {
    router.push("/");
    createNewChat();
    if (isMobile) setMobileOpen(false);
  }, [createNewChat, isMobile, router]);

  const handleSessionClick = useCallback(() => {
    router.push("/");
    if (isMobile) setMobileOpen(false);
  }, [isMobile, router]);

  const sidebarContent = (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-muted/20 transition-all duration-300 ease-in-out",
        expanded ? "w-[280px]" : "w-[60px]",
        isMobile ? "w-[280px]" : "",
      )}
    >
      {/* Top Section */}
      <div className={cn("flex flex-col border-b p-4 gap-2")}>
        {/* Hamburger */}
        {expanded ? (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2 hidden md:block"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* New Chat */}
        {expanded ? (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2"
            onClick={handleNewChat}
          >
            <Plus className="h-5 w-5" />
            <span>New Chat</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
        {expanded && <ChatHistory onSessionClick={handleSessionClick} />}
      </div>

      {/* Bottom Section */}
      <div className="border-t p-4">
        {expanded ? (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2"
            asChild
          >
            <Link href="/textbooks">
              <Book className="h-5 w-5" />
              <span>Sejarah Textbooks</span>
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" title="Sejarah Textbooks" asChild>
            <Link href="/textbooks">
              <Book className="h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );

  // Mobile: overlay
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-40 md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Mobile Sidebar Overlay */}
        <div
          className={cn(
            "fixed inset-0 z-50 flex transition-all duration-300",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          {/* Backdrop */}
          <div
            className={cn(
              "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
              mobileOpen ? "opacity-50" : "opacity-0",
            )}
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div
            className={cn(
              "relative z-50 h-full bg-background shadow-xl transition-transform duration-300 ease-in-out",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop: fixed sidebar
  return (
    <>
      <aside className="hidden md:block h-screen sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}
