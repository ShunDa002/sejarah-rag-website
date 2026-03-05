"use client";

import { useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/ChatContext";

import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

export function ChatArea() {
  const { activeSession, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  const isEmpty = !activeSession || activeSession.messages.length === 0;

  return (
    <div className="flex h-full flex-col relative w-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Explore History
              </h2>
              <p className="text-muted-foreground">
                Ask me anything about Malaysian history.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl px-4 pb-4">
            {activeSession.messages.map((message, index) => {
              const isLastAssistant =
                message.role === "assistant" &&
                index === activeSession.messages.length - 1;
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLoading={isLastAssistant && isLoading}
                  isLatest={isLastAssistant}
                />
              );
            })}

            {/* Thinking indicator – shown while waiting for AI response */}
            {isLoading &&
              activeSession.messages[activeSession.messages.length - 1]
                ?.role === "user" && (
                <div className="flex w-full gap-4 py-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm">
                    <Sparkles
                      className={cn("h-4 w-4 text-primary animate-pulse")}
                    />
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-[blink_1.4s_ease-in-out_infinite]" />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-[blink_1.4s_ease-in-out_0.2s_infinite]" />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-[blink_1.4s_ease-in-out_0.4s_infinite]" />
                  </div>
                </div>
              )}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
}
