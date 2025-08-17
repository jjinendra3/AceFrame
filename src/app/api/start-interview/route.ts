import { createInterview } from "@/db/dbFunctions";

export async function POST(req: Request) {
  try {
    const { userId, round } = await req.json();
    const response = await createInterview(round, userId);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
