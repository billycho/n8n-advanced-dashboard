import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent";
import UserWorkflowPermission from "@/models/UserWorkflowPermission";
import { withAuth } from "@/lib/auth/withAuth";

// GET all agents
export const GET = withAuth(async (req: Request, context: any, session: any) => {
  await connectDB();

  let filter = {};

  if (session?.user?.role === "client") {
    const permissions = await UserWorkflowPermission.find({
      user: session.user.id,
      ai_agent: { $exists: true, $ne: null }
    });

    const assignedAgentIds = permissions.map(p => p.ai_agent);
    filter = { _id: { $in: assignedAgentIds } };
  }

  const agents = await AIAgent.find(filter);

  return Response.json(agents);
});

// CREATE new agent
export const POST = withAuth(async (req: Request, context: any, session: any) => {
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
});