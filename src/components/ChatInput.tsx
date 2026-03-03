"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function ChatInput() {
  const [value, setValue] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isLoading } = useChat();

  const isTextOnly = value.trim().length > 0 && !image;
  const isImageOnly = image !== null && value.trim().length === 0;
  const canSend = (isTextOnly || isImageOnly) && !isLoading;

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

    const formData = new FormData();
    formData.append("query", value.trim());
    if (image) {
      formData.append("image", image);
    }

    sendMessage(formData);
    setValue("");
    setImage(null);
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [canSend, value, image, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4">
      <div className="relative flex flex-col rounded-xl border bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
        {image ? (
          <div className="flex items-center gap-2 p-3 w-full">
            <div className="relative flex items-center justify-center bg-muted rounded-md h-10 w-10 overflow-hidden">
              <img
                src={URL.createObjectURL(image)}
                alt="Upload preview"
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-sm truncate flex-1">{image.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={removeImage}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className={cn(
                "ml-2 shrink-0 transition-opacity",
                canSend ? "opacity-100" : "opacity-50 cursor-not-allowed",
              )}
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label="Send image"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-end w-full">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mb-2 ml-2 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              aria-label="Upload image"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <textarea
              ref={textareaRef}
              className="max-h-[200px] min-h-[50px] w-full resize-none bg-transparent px-3 py-3 text-sm md:text-base focus:outline-none disabled:opacity-50"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Jelaskan pelaksanaan hukuman jenayah dalam Hukum Kanun Melaka..."
              rows={1}
              disabled={isLoading}
            />
            <Button
              size="icon"
              className={cn(
                "mb-2 mr-2 shrink-0 transition-opacity",
                canSend ? "opacity-100" : "opacity-50 cursor-not-allowed",
              )}
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        AI responses may be wrong. Verify important information.
      </p>
    </div>
  );
}
