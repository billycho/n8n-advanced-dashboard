import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent";

export async function GET() {
  await connectDB();

  const agents = await AIAgent.find();

  return Response.json(agents);
}

// CREATE new agent
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const agent = await AIAgent.create({
      name: body.name,
      description: body.description,
      category: body.category,
      environment: body.environment,
      webhook_url: body.webhook_url,
      workflow_id: body.workflow_id,
      model: body.model,
      slug: body.slug,
    });

    return Response.json(agent, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Failed to create AI Agent" },
      { status: 500 }
    );
  }
}
