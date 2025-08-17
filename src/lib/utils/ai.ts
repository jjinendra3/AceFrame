import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const aiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.3
});


export const aiEmbeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
});