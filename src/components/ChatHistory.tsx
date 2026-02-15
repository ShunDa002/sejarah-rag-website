"use client";

import { useState, useCallback } from "react";
import { MessageSquare, MoreHorizontal, Trash2 } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { ContextMenu } from "./ContextMenu";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Loading from "@/app/loading";

interface ChatHistoryProps {
  onSessionClick?: () => void;
}

export function ChatHistory({ onSessionClick }: ChatHistoryProps) {
  const {
    groupedSessions,
    activeSessionId,
    setActiveSession,
    deleteSession,
    isSessionsLoading,
  } = useChat();
  const [contextMenu, setContextMenu] = useState<{
    sessionId: string;
    x: number;
    y: number;
  } | null>(null);

  const handleClick = useCallback(
    (id: string) => {
      setActiveSession(id);
      onSessionClick?.();
    },
    [setActiveSession, onSessionClick],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, sessionId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({ sessionId, x: e.clientX, y: e.clientY });
    },
    [],
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, sessionId: string) => {
      e.stopPropagation();
      e.preventDefault();
      deleteSession(sessionId);
    },
    [deleteSession],
  );

  if (isSessionsLoading) {
    return <Loading />;
  }

  if (groupedSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground gap-2">
        <MessageSquare className="h-8 w-8 opacity-50" />
        <span className="text-sm">No conversations yet</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-2 pb-20">
      {groupedSessions.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {group.label}
          </div>
          {group.sessions.map((session) => (
            <div
              key={session.id}
              role="button"
              tabIndex={0}
              className={cn(
                "group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground",
                session.id === activeSessionId
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
              onClick={() => handleClick(session.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleClick(session.id);
              }}
              onContextMenu={(e) => handleContextMenu(e, session.id)}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate flex-1 text-left">{session.title}</span>

              <div
                className={cn(
                  "opacity-0 transition-opacity group-hover:opacity-100",
                  contextMenu?.sessionId === session.id ? "opacity-100" : "",
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => handleDeleteClick(e, session.id)}
                  aria-label="Delete chat"
                  title="Delete chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {contextMenu && (
        <ContextMenu
          sessionId={contextMenu.sessionId}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
