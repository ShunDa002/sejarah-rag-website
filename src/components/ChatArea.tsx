"use client";

import { useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
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
                Ask me anything about Malaysian history — from ancient kingdoms
                to modern nationhood.
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
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
}
