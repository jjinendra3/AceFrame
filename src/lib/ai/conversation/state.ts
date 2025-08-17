import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

export const InterviewState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
    }),
    interviewId: Annotation<string>(),
    round: Annotation<string>(),
    timeLeft: Annotation<string>(),
    userInput: Annotation<string>(),
    audioFile: Annotation<ArrayBuffer | null>(),
    speechToText: Annotation<string>(),
    reply: Annotation<string>(),
    dsaQuestion: Annotation<string | null>(),
    codeHelp: Annotation<string | null>(),
    audioResponse: Annotation<string>(),
    isComplete: Annotation<boolean>(),
});

export const initialState = {
    messages: [],
    interviewId: "",
    round: "",
    timeLeft: "",
    userInput: "",
    audioFile: null,
    speechToText: "",
    reply: "",
    dsaQuestion: null,
    codeHelp: null,
    audioResponse: "",
    isComplete: false,
};

export type InterviewStateType = typeof InterviewState.State;