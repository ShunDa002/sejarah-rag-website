"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { type Message } from "@/context/ChatContext";
import { CodeBlock } from "./CodeBlock";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isLoading: boolean;
  isLatest: boolean;
}

export function MessageBubble({
  message,
  isLoading,
  isLatest,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  // Typewriter effect state
  const isNewAssistantMessage = useMemo(() => {
    return (
      message.role === "assistant" &&
      isLatest &&
      Date.now() - message.timestamp < 3000
    );
  }, [message.role, isLatest, message.timestamp]);

  const [revealedContent, setRevealedContent] = useState(
    isNewAssistantMessage ? "" : message.content,
  );
  const [isTyping, setIsTyping] = useState(isNewAssistantMessage);

  // Handle typewriter animation
  useEffect(() => {
    if (!isTyping) return;

    if (revealedContent.length < message.content.length) {
      const timeout = setTimeout(() => {
        // Increase step size for longer messages to maintain feel
        const step = message.content.length > 500 ? 3 : 1;
        setRevealedContent(
          message.content.slice(0, revealedContent.length + step),
        );
      }, 10);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [isTyping, revealedContent.length, message.content]);

  // Sync content if message updates externally (e.g. error states)
  useEffect(() => {
    if (!isTyping && revealedContent !== message.content) {
      setRevealedContent(message.content);
    }
  }, [message.content, isTyping, revealedContent]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  const markdownComponents = useMemo(
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      code({ className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || "");
        const isInline = !match;

        if (isInline) {
          return (
            <code
              className={cn(
                "bg-muted px-1.5 py-0.5 rounded-sm text-sm font-mono",
                className,
              )}
              {...props}
            >
              {children}
            </code>
          );
        }

        return (
          <CodeBlock language={match[1]}>
            {String(children).replace(/\n$/, "")}
          </CodeBlock>
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pre({ children }: any) {
        return <>{children}</>;
      },
      // Ensure paragraphs don't add extra margin in nested structures
      p({ children }: any) {
        return <p className="mb-4 last:mb-0 leading-7">{children}</p>;
      },
    }),
    [],
  );

  if (message.role === "user") {
    return (
      <div className="flex w-full justify-end py-4">
        <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-tr-sm px-5 py-2.5 shadow-sm">
          <p className="whitespace-pre-wrap leading-7">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-4 py-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm">
        <Sparkles
          className={cn(
            "h-4 w-4 text-primary",
            isLoading && isLatest && "animate-pulse",
          )}
        />
      </div>
      <div className="flex-1 space-y-4 overflow-hidden min-w-0">
        <div className="markdown-body text-foreground relative">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={markdownComponents}
          >
            {revealedContent}
          </ReactMarkdown>

          {isTyping && (
            <span className="inline-block w-2 h-4 ml-1 bg-primary/60 animate-pulse align-middle" />
          )}
        </div>

        {/* Action row - only show after typing is complete and not loading */}
        {!isLoading && !isTyping && (
          <div className="flex items-center gap-2 pt-2 animate-in fade-in duration-500">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
              aria-label="Copy response"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        )}

        {/* Citations */}
        {message.citations &&
          message.citations.length > 0 &&
          !isLoading &&
          !isTyping && (
            <div className="mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-1 duration-500">
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                Sources:
              </p>
              <div className="flex flex-wrap gap-2">
                {message.citations.map((citation, i) => (
                  <div
                    key={i}
                    className="text-xs bg-secondary hover:bg-secondary/80 transition-colors px-2 py-1 rounded text-secondary-foreground border"
                  >
                    {citation}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
