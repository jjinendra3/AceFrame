import { StateGraph, START, END } from "@langchain/langgraph";
import { ResumeState } from "./state";
import { generateResumeReview, generateVectorEmbeddingOfPdf } from "./node";

function createResumeGraph() {
    const workflow = new StateGraph(ResumeState)
        .addNode("generate_pdf_embedding", generateVectorEmbeddingOfPdf)
        .addNode("generate_review", generateResumeReview)
        .addEdge(START, "generate_pdf_embedding")
        .addConditionalEdges('generate_pdf_embedding', (state) => state.country !== "Not Found" ? "continue" : "end", {
            continue: "generate_review",
            end: END
        })
        .addEdge("generate_pdf_embedding", "generate_review")
        .addEdge("generate_review", END);

    return workflow.compile();
}
export const graph = createResumeGraph();
