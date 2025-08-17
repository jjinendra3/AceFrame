import { graph } from "@/lib/ai/resume/graph";
import { initialState } from "@/lib/ai/resume/state";


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const country = formData.get("country") as string;
    if (!file || !country) {
      return Response.json(
        { error: "Missing file or country" },
        { status: 400 },
      );
    }
    const initiateState = {
      ...initialState,
      resume: file,
      country: country,
    }
    const response = await graph.invoke(initiateState)
    if (response.country === "Not Found") throw new Error("Country not found");
    return Response.json(response);
  } catch {
    return Response.json(
      { error: "Failed to process resume" },
      { status: 500 },
    );
  }
}
