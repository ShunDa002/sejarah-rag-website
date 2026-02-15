"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContextMenuProps {
  sessionId: string;
  x: number;
  y: number;
  onClose: () => void;
}

export function ContextMenu({ sessionId, x, y, onClose }: ContextMenuProps) {
  const { deleteSession, renameSession, sessions } = useChat();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const session = sessions.find((s) => s.id === sessionId);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      // Initialize with current title
      if (session) setRenameValue(session.title);
    }
  }, [isRenaming, session]);

  // Position adjustment to stay in viewport
  const adjustedX = Math.min(
    x,
    typeof window !== "undefined" ? window.innerWidth - 220 : x,
  );
  const adjustedY = Math.min(
    y,
    typeof window !== "undefined" ? window.innerHeight - 150 : y,
  );

  const handleRenameClick = useCallback(() => {
    if (!session) return;
    setIsRenaming(true);
  }, [session]);

  const submitRename = useCallback(() => {
    if (renameValue.trim()) {
      renameSession(sessionId, renameValue.trim());
    }
    onClose();
  }, [renameValue, renameSession, sessionId, onClose]);

  const handleDelete = useCallback(() => {
    deleteSession(sessionId);
    onClose();
  }, [deleteSession, sessionId, onClose]);

  if (!session) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95",
      )}
      style={{ left: adjustedX, top: adjustedY }}
    >
      {isRenaming ? (
        <div className="flex flex-col gap-2 p-1">
          <Input
            ref={inputRef}
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitRename();
              if (e.key === "Escape") onClose();
            }}
            className="h-8 text-sm"
            maxLength={60}
          />
          <div className="flex gap-1">
            <Button size="sm" className="h-7 flex-1" onClick={submitRename}>
              <Check className="mr-1 h-3 w-3" /> Save
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={onClose}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <button
            className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            onClick={handleRenameClick}
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </button>
          <button
            className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-destructive/10 hover:text-destructive text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </button>
        </>
      )}
    </div>
  );
}
