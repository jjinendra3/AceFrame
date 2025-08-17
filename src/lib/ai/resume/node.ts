import { ResumeStateType } from "./state";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { aiModel } from "@/lib/utils/ai";
import z from "zod";
import { getPrompts } from "@/db/dbFunctions";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const schema = z.object({
    rating: z.number().int().min(0).max(100),
    detailedReview: z.string(),
});

export const extractPDFText = async (state: ResumeStateType) => {
    try {
        const { resume } = state;

        if (!resume) {
            console.error("No resume file provided");
            return;
        }

        const loader = new PDFLoader(resume);
        const docs = await loader.load();

        const fullText = docs[0]?.pageContent || "";
        return {
            ...state,
            textResume: fullText,
        };

    } catch (error) {
        console.error("Error generating vector embeddings:", error);
        throw error;
    }
}

export const generateResumeReview = async (state: ResumeStateType) => {
    const { textResume, country } = state;
    try {
        const systemInstruction = await getPrompts('resume');
        const structuredLlm = aiModel.withStructuredOutput(schema);

        const response = await structuredLlm.invoke([
            new SystemMessage(`${systemInstruction} \n\nCountry: ${country}`),
            new HumanMessage(`Context: ${textResume}`)
        ]);

        return {
            ...state,
            rating: response.rating,
            detailedReview: response.detailedReview,
        };

    } catch (error) {
        console.error("Error generating resume review:", error);
        throw error;
    }
}