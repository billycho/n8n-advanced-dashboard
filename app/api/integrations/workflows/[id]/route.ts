import { connectDB } from "@/lib/mongodb";
import Workflow from "@/models/Workflow";
import { withAPIKey } from "@/lib/auth/withAPIKey";

export const GET = withAPIKey(
  async (
    req: Request,
    { params }: { params: { id: string } }
  ) => {
    await connectDB();

    const { id } = params;

    const workflow = await Workflow.findById(id);

    if (!workflow) {
      return Response.json({ error: "Workflow not found" }, { status: 404 });
    }

    return Response.json(workflow);
  }
);
