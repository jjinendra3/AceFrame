import { StateGraph, START, END } from "@langchain/langgraph";
import { InterviewState } from "./state";
import {
    loadHistoryNode,
    processInputNode,
    generateResponseNode,
    textToSpeechNode,
    saveToDbNode,
    shouldContinue,
} from "./nodes";
function createInterviewGraph() {
    const workflow = new StateGraph(InterviewState)
    .addNode("load_history", loadHistoryNode)
    .addNode("process_input", processInputNode)
    .addNode("generate_response", generateResponseNode)
    .addNode("text_to_speech", textToSpeechNode)
    .addNode("save_to_db", saveToDbNode)
    .addEdge(START, "load_history")
    .addEdge("load_history", "process_input")
    .addEdge("process_input", "generate_response")
    .addEdge("generate_response", "text_to_speech")
    .addConditionalEdges(
        "text_to_speech",
            shouldContinue,
            {
                save_to_db: "save_to_db",
                end: END,
            }
        )
        .addEdge("save_to_db", END);
        
        return workflow.compile();
    }
    export const graph = createInterviewGraph();
    
//TODO: Implement tool calling so that AI can end the call.