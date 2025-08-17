import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { aiModel } from "../../utils/ai";
import { z } from "zod4";
import { getChatHistory, saveToDbUser, saveToDbModel, getPrompts } from "@/db/dbFunctions";
import { getAudio, getText } from "@/app/api/interview/helpers/speech";
import { InterviewStateType } from "./state";

const responseSchema = z.object({
    speechToText: z.string(),
    reply: z.string(),
    dsaQuestion: z.string().nullable(),
    codeHelp: z.string().nullable(),
});

export async function loadHistoryNode(state: InterviewStateType) {
    const { interviewId } = state;

    try {
        const history = await getChatHistory(interviewId);

        const historyMessages = (history || []).map((msg) => {
            const content = typeof msg.content === "string"
                ? msg.content
                : JSON.stringify(msg.content);

            if (msg.role === "user") return new HumanMessage(content);
            if (msg.role === "assistant") return new AIMessage(content);
            return null;
        }).filter(Boolean);

        return {
            ...state,
            messages: historyMessages,
        };
    } catch (error) {
        console.error("Error loading history:", error);
        return { messages: [] };
    }
}

export async function processInputNode(state: InterviewStateType) {
    const { userInput, audioFile } = state;

    const audioToText = audioFile ? await getText(audioFile) : "";
    const processedInput = audioToText + userInput;

    return {
        messages: [new HumanMessage(processedInput)],
        speechToText: processedInput,
    };
}

export async function generateResponseNode(state: InterviewStateType) {
    const { round, timeLeft, messages, speechToText } = state;

    try {
        const systemInstruction = await getPrompts(round);
        if (!systemInstruction || typeof systemInstruction !== "string") {
            throw new Error("Invalid system instruction");
        }
        const structuredLlm = aiModel.withStructuredOutput(responseSchema);

        const response = await structuredLlm.invoke([
            new SystemMessage(systemInstruction),
            ...messages,
            new HumanMessage(`TimeLeft: ${timeLeft}\n\nUser input: ${speechToText}`)
        ]);

        return {
            messages: [new AIMessage(response.reply)],
            speechToText: response.speechToText,
            reply: response.reply,
            dsaQuestion: response.dsaQuestion,
            codeHelp: response.codeHelp,
        };
    } catch (error) {
        console.error("Error generating response:", error);
        return {
            reply: "I'm having trouble processing your request. Please try again.",
            speechToText: state.speechToText || "",
            dsaQuestion: null,
            codeHelp: null,
        };
    }
}

export async function textToSpeechNode(state: InterviewStateType) {
    const { reply } = state;

    try {
        const audio = await getAudio(reply);
        if (!audio) throw new Error("Audio generation failed");

        const audioBase64 = audio.toString("base64");

        return {
            audioResponse: audioBase64,
        };
    } catch (error) {
        console.error("Error in text-to-speech:", error);
        const fs = await import("fs");
        const audioBuffer = fs.readFileSync("/sound/error.wav");
        const audioBase64 = audioBuffer.toString("base64");

        return {
            audioResponse: audioBase64,
        };
    }
}

export async function saveToDbNode(state: InterviewStateType) {
    const { interviewId, speechToText, reply } = state;

    try {
        await saveToDbUser(speechToText, interviewId);
        await saveToDbModel(reply, interviewId);

        return {
            isComplete: true,
        };
    } catch (error) {
        console.error("Error saving to database:", error);
        return {
            isComplete: true,
        };
    }
}

export function shouldContinue(state: InterviewStateType): string {
    if (state.reply && state.audioResponse) {
        return "save_to_db";
    }
    return "end";
}