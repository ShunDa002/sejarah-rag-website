"use server";

import { db } from "@/lib/prisma";
import { MessageRole } from "@/generated/prisma/client";
import { auth } from "@/auth";
import {
  AnswerResponse,
  AnswerRequest,
  HealthResponse,
  SeedResponse,
} from "@/types/rag";

const API_BASE_URL = process.env.RAG_API_URL || "http://127.0.0.1:8000";

/**
 * Ensures a chat session exists in the database.
 * This should be called before sendChatMessage for new chats to enable persistence.
 */
export async function createOrUpdateChatSession(
  sessionId: string,
  title: string,
) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const existingSession = await db.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (existingSession) {
      // If user is now logged in but session was anonymous or linked to another user (unlikely),
      // we update the userId if it's currently null.
      if (userId && !existingSession.userId) {
        return await db.chatSession.update({
          where: { id: sessionId },
          data: { userId },
        });
      }
      return existingSession;
    }

    // Create new session
    return await db.chatSession.create({
      data: {
        id: sessionId,
        title,
        userId: userId || null,
      },
    });
  } catch (error) {
    console.error("Failed to create/update chat session:", error);
    throw new Error("Failed to create chat session");
  }
}

/**
 * Handles the full chat cycle with the following logic:
 * 1. Authentication & Session Verification
 * 2. User Message Storage (if authenticated)
 * 3. Request to Backend (FastAPI)
 * 4. AI Response Storage (if authenticated)
 */
export async function sendChatMessage(
  sessionId: string,
  content: string,
): Promise<AnswerResponse> {
  // 1. Authentication & Session Verification
  const session = await auth();
  const userId = session?.user?.id;

  // Verify if the session exists in the database
  const dbSession = await db.chatSession.findUnique({
    where: { id: sessionId },
  });

  // Persistence logic: Only save if user is authenticated AND a valid session exists
  // Also verify that if the session has a userId, it matches the current user.
  const isAuthorized =
    dbSession && (!dbSession.userId || dbSession.userId === userId);
  const shouldSave = !!userId && !!dbSession && isAuthorized;

  // 2. User Message Storage (Only if authenticated and valid session)
  if (shouldSave) {
    try {
      await db.chatMessage.create({
        data: {
          chatSessionId: sessionId,
          role: MessageRole.user,
          content: content,
        },
      });

      await db.chatSession.update({
        where: { id: sessionId },
        data: { updatedAt: new Date() },
      });
    } catch (error) {
      console.error("Failed to save user message:", error);
    }
  }

  // 3. Request to Backend (FastAPI)
  try {
    const requestBody: AnswerRequest = { query: content, top_k: 6 };
    const res = await fetch(`${API_BASE_URL}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `AI service error: ${res.statusText}`,
      );
    }

    const aiResponse: AnswerResponse = await res.json();

    // 4. AI Response Storage (Only if authenticated and valid session)
    if (shouldSave) {
      try {
        await db.chatMessage.create({
          data: {
            chatSessionId: sessionId,
            role: MessageRole.assistant,
            content: aiResponse.text,
          },
        });

        await db.chatSession.update({
          where: { id: sessionId },
          data: { updatedAt: new Date() },
        });
      } catch (error) {
        console.error("Failed to save AI response:", error);
      }
    }

    return aiResponse;
  } catch (error) {
    console.error("Chat message process failed:", error);
    throw error;
  }
}

/**
 * Health check for FastAPI backend
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
  } catch (error) {
    console.error("Health check failed:", error);
    throw error;
  }
}

/**
 * Seeds a document into the RAG system
 */
export async function seedDocument(formData: FormData): Promise<SeedResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/seed`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Seeding failed");
    }
    return res.json();
  } catch (error) {
    console.error("Seeding failed:", error);
    throw error;
  }
}

/**
 * Deletes a chat session
 */
export async function deleteChatSession(sessionId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }

  try {
    const existingSession = await db.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) return;

    if (existingSession.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await db.chatSession.delete({
      where: { id: sessionId },
    });
  } catch (error) {
    console.error("Failed to delete chat session:", error);
    throw new Error("Failed to delete chat session");
  }
}

/**
 * Retrieves chat sessions for the authenticated user
 */
export async function getChatSessions() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  try {
    const sessions = await db.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    return sessions;
  } catch (error) {
    console.error("Failed to get chat sessions:", error);
    return [];
  }
}
