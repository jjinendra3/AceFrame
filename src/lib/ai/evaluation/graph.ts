import { StateGraph, START, END } from "@langchain/langgraph";
import { EvaluationState } from "./state";
import {
    generateEvaluationReport,
} from "./nodes";
import { loadHistoryNode } from "../conversation/nodes";

function createEvaluationGraph() {
    const workflow = new StateGraph(EvaluationState)
        .addNode("load_history", loadHistoryNode)
        .addNode("generate_response", generateEvaluationReport)
        .addEdge(START, "load_history")
        .addEdge("load_history", "generate_response")
        .addEdge("generate_response", END);

    return workflow.compile();
}
export const graph = createEvaluationGraph();
