import { graph } from "@/lib/ai/evaluation/graph";
import { initialState } from "@/lib/ai/evaluation/state";

export async function POST(req: Request) {
  try {
    const { interviewId, round } = await req.json();
    const initiateState = {
      ...initialState,
      interviewId,
      round,
    }
    const response = await graph.invoke(initiateState);

    if (!response) {
      throw new Error("Failed to generate response");
    }
    console.log(response)
    return new Response(
      JSON.stringify({
        success: true,
        data: response.completeReport,
      }),
      { status: 200 }
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        data: null,
      }),
      { status: 500 }
    );
  }
}
