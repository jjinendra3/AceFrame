import { Annotation } from "@langchain/langgraph";

export const ResumeState = Annotation.Root({
    resume: Annotation<File | null>(),
    country: Annotation<string>(),
    rating: Annotation<number>(),
    detailedReview: Annotation<string>(),
    textResume: Annotation<string>(),
});

export const initialState = {
    resume: null,
    country: "",
    rating: 0,
    detailedReview: "",
    textResume: ""
};

export type ResumeStateType = typeof ResumeState.State;