"use client";

import { useChat } from "@/context/ChatContext";
import { ThemeToggle } from "./ThemeToggle";
import { HeaderAuth } from "./HeaderAuth";
import { usePathname } from "next/navigation";

export function Header() {
  const { activeSession } = useChat();
  const pathname = usePathname();

  const getHeaderTitle = () => {
    if (pathname === "/textbooks") {
      return "Buku Teks Sejarah";
    }
    if (pathname?.startsWith("/textbooks/")) {
      return "Detail Buku Teks";
    }
    if (activeSession) {
      return activeSession.title;
    }
    return "Sejarah RAG Chat";
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-2 overflow-hidden pl-12 md:pl-0">
        <h1 className="truncate text-sm font-medium">{getHeaderTitle()}</h1>
      </div>
      <div className="flex items-center gap-2">
        <HeaderAuth />
        <ThemeToggle />
      </div>
    </header>
  );
}
