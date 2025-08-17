import { graph } from "@/lib/ai/conversation/graph";
import { initialState } from "@/lib/ai/conversation/state";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const arrayBuffer = file ? await file.arrayBuffer() : null;
    const interviewId = formData.get("interviewId") as string;
    const timeLeft = formData.get("timeLeft") as string;
    const text = formData.get("text") as string;
    const round = formData.get("round") as string;

    if (!interviewId || !timeLeft || !round) {
      return new Response("Missing parameters", { status: 400 });
    }

    const initiateState = {
      ...initialState,
      interviewId: interviewId,
      round: round,
      timeLeft: timeLeft,
      userInput: text || "",
      audioFile: arrayBuffer,
    }

    const result = await graph.invoke(initiateState);

    const response = {
      audio: result.audioResponse,
      dsaQuestion: result.dsaQuestion,
      codeHelp: result.codeHelp,
      reply: result.reply,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error in interview conversation:", error);

    const audioBuffer = fs.readFileSync("/sound/error.wav");
    const audioBase64 = audioBuffer.toString("base64");
    const response = {
      audio: audioBase64,
      dsaQuestion: null,
      codeHelp: null,
      reply: "Sorry, I encountered an error. Please try again.",
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });

  }
}