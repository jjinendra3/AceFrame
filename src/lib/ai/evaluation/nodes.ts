import { getPrompts } from "@/db/dbFunctions";
import { EvaluationStateType } from "./state";
import { aiModel } from "@/lib/utils/ai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from 'zod'
export const InterviewEvaluationSchema = z.object({
    scores: z.object({
        communicationSkills: z.number().min(0).max(10),
        technicalKnowledge: z.number().min(0).max(10),
        problemSolvingAbility: z.number().min(0).max(10),
        behavioralCompetence: z.number().min(0).max(10),
        overallImpression: z.number().min(0).max(10),
    }),

    feedback: z.object({
        communicationFeedback: z.string().min(50),
        technicalFeedback: z.string().min(50),
        problemSolvingFeedback: z.string().min(50),
        behavioralFeedback: z.string().min(50),
        overallFeedback: z.string().min(100),
    }),

    highlights: z.object({
        topStrengths: z.array(z.string()).min(2).max(5),
        improvementAreas: z.array(z.string()).min(2).max(5),
    }),

    recommendations: z.array(z.string()).min(3).max(7),

    keyMoments: z
        .array(
            z.object({
                question: z.string(),
                responseEvaluation: z.string().min(50),
                improvementSuggestion: z.string().min(30),
            })
        )
        .min(2)
        .max(5),
    report: z.string().min(300),
});

export const generateEvaluationReport = async (state: EvaluationStateType) => {
    try {
        const systemInstruction = await getPrompts('google-hr-end');
        if (!systemInstruction || typeof systemInstruction !== "string") {
            throw new Error("Failed to retrieve valid system instruction");
        }
        const structuredLlm = aiModel.withStructuredOutput(InterviewEvaluationSchema);
        const response = await structuredLlm.invoke([
            new SystemMessage(systemInstruction),
            ...state.messages,
            new HumanMessage(`Please take the entire chat between the user and the assistant into account when generating the report. The output should be strictly in html and contain all relevant information. The HTML will be converted to PDF, so please ensure it is well-formed.`)
        ]);
        return {
            ...state,
            report: response.report,
            completeReport: InterviewEvaluationSchema.parse(response),
        };
    } catch (error) {
        console.error("Error generating evaluation report:", error);
        return {
            success: false,
            error: "Failed to generate evaluation report"
        }
    }
}
