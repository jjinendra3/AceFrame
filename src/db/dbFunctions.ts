import { CoreMessage } from "ai";
import prisma from "./prisma";

export const createInterview = async (round: string, candidateId: string) => {
  return await prisma.interview.create({
    data: {
      round: round,
      candidateId: candidateId,
    },
  });
};

export const saveToDbUser = async (text: string, interviewId: string) => {
  return await prisma.conversation.create({
    data: {
      role: "user",
      text: text,
      interviewId: interviewId,
    },
  });
};

export const saveToDbModel = async (text: string, interviewId: string) => {
  return await prisma.conversation.create({
    data: {
      role: "assistant",
      text: text,
      interviewId: interviewId,
    },
  });
};

export const getChatHistory = async (
  interviewId: string,
): Promise<CoreMessage[]> => {
  try {
    const response = await prisma.conversation.findMany({
      where: {
        interviewId: interviewId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return response
      .map((item) =>
        item.role === "user" || item.role === "assistant"
          ? { role: item.role as "user" | "assistant", content: item.text }
          : null,
      )
      .filter(Boolean) as CoreMessage[];
  } catch {
    return [];
  }
};

export const getPrompts = async (round: string) => {
  try {
    const response = await prisma.prompts.findUnique({
      where: {
        name: round,
      },
    });
    return response?.prompt;
  } catch {
    return null;
  }
};

export const saveInterviewFeedback = async (interviewId: string, feedback: string) => {
  return await prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      feedback: feedback,
    },
  });
}