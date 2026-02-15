"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import {
  sendChatMessage,
  createOrUpdateChatSession,
  deleteChatSession,
  getChatSessions,
} from "@/lib/actions/chat.actions";
import { useSession } from "next-auth/react";

/* ---------- Types ---------- */
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[]; // Updated to match the backend (list of strings)
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface DateGroup {
  label: string;
  sessions: ChatSession[];
}

interface ChatContextType {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  isLoading: boolean;
  input: string;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
  ) => void;
  createNewChat: () => void;
  deleteSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  setActiveSession: (id: string) => void;
  sendMessage: (content: string) => void;
  groupedSessions: DateGroup[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/* ---------- Helpers ---------- */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getDateLabel(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const yesterday = today - 86400000;
  const lastWeek = today - 7 * 86400000;
  const lastMonth = today - 30 * 86400000;

  if (timestamp >= today) return "Today";
  if (timestamp >= yesterday) return "Yesterday";
  if (timestamp >= lastWeek) return "Previous 7 Days";
  if (timestamp >= lastMonth) return "Previous 30 Days";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function groupSessionsByDate(sessions: ChatSession[]): DateGroup[] {
  const groups = new Map<string, ChatSession[]>();
  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  for (const session of sorted) {
    const label = getDateLabel(session.updatedAt);
    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(session);
  }

  const result: DateGroup[] = [];
  for (const [label, sessions] of groups.entries()) {
    result.push({ label, sessions });
  }
  return result;
}

/* ---------- Provider ---------- */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: sessionData } = useSession();
  const userId = sessionData?.user?.id;

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const groupedSessions = groupSessionsByDate(sessions);

  const createNewChat = useCallback(() => {
    if (userId) {
      // Check for existing empty session
      const existingEmpty = sessions.find((s) => s.messages.length === 0);
      if (existingEmpty) {
        setActiveSessionId(existingEmpty.id);
        return;
      }
      const newSession: ChatSession = {
        id: generateId(),
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setInput("");
    } else {
      // Guest: wipe and start fresh
      const newSession: ChatSession = {
        id: generateId(),
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
      setInput("");
    }
  }, [sessions, userId]);

  // Fetch sessions on mount/auth
  useEffect(() => {
    async function loadSessions() {
      if (!userId) return;

      try {
        const fetchedSessions = await getChatSessions();
        const mappedSessions: ChatSession[] = fetchedSessions.map((s: any) => ({
          id: s.id,
          title: s.title,
          createdAt: new Date(s.createdAt).getTime(),
          updatedAt: new Date(s.updatedAt).getTime(),
          messages: s.messages.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.createdAt).getTime(),
          })),
        }));

        // Always initialize with a new empty chat at the top
        const newSession: ChatSession = {
          id: generateId(),
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        setSessions([newSession, ...mappedSessions]);
        setActiveSessionId(newSession.id);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    }

    loadSessions();
  }, [userId]);

  const deleteSession = useCallback(
    async (id: string) => {
      // Smart selection: if deleting active session, switch to new blank one
      if (activeSessionId === id) {
        const newSession: ChatSession = {
          id: generateId(),
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        if (userId) {
          // Keep other sessions, replace current with new blank
          setSessions((prev) => [
            newSession,
            ...prev.filter((s) => s.id !== id),
          ]);
        } else {
          // Guest: just reset to new session
          setSessions([newSession]);
        }
        setActiveSessionId(newSession.id);
        setInput("");
      } else {
        // Just remove from list
        setSessions((prev) => prev.filter((s) => s.id !== id));
      }

      // Server action
      if (userId) {
        try {
          await deleteChatSession(id);
        } catch (error) {
          console.error("Failed to delete session:", error);
        }
      }
    },
    [activeSessionId, userId],
  );

  const renameSession = useCallback((id: string, title: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  }, []);

  const setActiveSession = useCallback((id: string) => {
    setActiveSessionId(id);
    setInput("");
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      let currentSessionId = activeSessionId;
      let sessionTitle = "New Chat";

      if (!currentSessionId) {
        // Create new session first locally
        sessionTitle = content.slice(0, 40) + (content.length > 40 ? "…" : "");
        const newId = generateId();
        const newSession: ChatSession = {
          id: newId,
          title: sessionTitle,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newId);
        currentSessionId = newId;
      } else {
        const session = sessions.find((s) => s.id === currentSessionId);
        if (session && session.messages.length === 0) {
          sessionTitle =
            content.slice(0, 40) + (content.length > 40 ? "…" : "");
          renameSession(currentSessionId, sessionTitle);
        } else if (session) {
          sessionTitle = session.title;
        }
      }

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      // Add user message to UI immediately
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                messages: [...s.messages, userMessage],
                updatedAt: Date.now(),
              }
            : s,
        ),
      );
      setInput("");
      setIsLoading(true);

      try {
        // Ensure session exists in DB for persistence
        await createOrUpdateChatSession(currentSessionId, sessionTitle);

        const response = await sendChatMessage(currentSessionId, content);

        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: response.text,
          citations: response.citations,
          timestamp: Date.now(),
        };

        // Add assistant message to UI
        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId
              ? {
                  ...s,
                  messages: [...s.messages, assistantMessage],
                  updatedAt: Date.now(),
                }
              : s,
          ),
        );
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId, sessions, renameSession],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
      if (typeof e === "string") {
        setInput(e);
      } else {
        setInput(e.target.value);
      }
    },
    [],
  );

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSessionId,
        activeSession,
        isLoading,
        input,
        handleInputChange,
        createNewChat,
        deleteSession,
        renameSession,
        setActiveSession,
        sendMessage,
        groupedSessions,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
}
