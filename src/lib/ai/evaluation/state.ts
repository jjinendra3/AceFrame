import { InterviewEvaluation } from "@/lib/types/types";
import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

export const EvaluationState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
    }),
    interviewId: Annotation<string>(),
    round: Annotation<string>(),
    report: Annotation<string>(),
    completeReport: Annotation<InterviewEvaluation>(),
});

export const initialState = {
    messages: [],
    interviewId: "",
    round: "",
    report: "",
    completeReport: {} as InterviewEvaluation,
};

export type EvaluationStateType = typeof EvaluationState.State;