import { connectDB } from "@/lib/mongodb";
import Workflow from "@/models/Workflow";
import { withAuth } from "@/lib/auth/withAuth";

// GET all workflows
export const GET = withAuth(async (req: Request, context: any, session: any) => {
  await connectDB();

  const workflows = await Workflow.find();

  return Response.json(workflows);
});

// CREATE new workflow
export const POST = withAuth(async (req: Request, context: any, session: any) => {
  try {
    await connectDB();

    const body = await req.json();

    const workflow = await Workflow.create({
      name: body.name,
      description: body.description,
      category: body.category,
      environment: body.environment,
      webhook_url: body.webhook_url,
      workflow_id: body.workflow_id,
      model: body.model,
      slug: body.slug,
      active: body.active !== undefined ? body.active : true,
      triggerType: body.triggerType || "Manual",
    });

    return Response.json(workflow, { status: 201 });
  } catch (error) {
    console.error("CREATE WORKFLOW ERROR:", error);
    return Response.json(
      { error: "Failed to create Workflow" },
      { status: 500 }
    );
  }
});
