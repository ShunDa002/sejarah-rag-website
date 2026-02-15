"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Send } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function ChatInput() {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading } = useChat();

  const canSend = value.trim().length > 0 && !isLoading;

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const maxHeight = 150; // ~6 rows
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [value]);

  const handleSubmit = useCallback(() => {
    if (!canSend) return;
    sendMessage(value.trim());
    setValue("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [canSend, value, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4">
      <div className="relative flex items-end rounded-xl border bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
        <textarea
          ref={textareaRef}
          className="max-h-[200px] min-h-[50px] w-full resize-none bg-transparent px-4 py-3 text-sm focus:outline-none disabled:opacity-50"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Malaysian history..."
          rows={1}
          disabled={isLoading}
        />
        <Button
          size="icon"
          className={cn(
            "mb-2 mr-2 shrink-0 transition-opacity",
            canSend ? "opacity-100" : "opacity-50 cursor-not-allowed"
          )}
          onClick={handleSubmit}
          disabled={!canSend}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        AI responses may be inaccurate. Verify important information.
      </p>
    </div>
  );
}
