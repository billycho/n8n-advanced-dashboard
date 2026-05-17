import { connectDB } from "@/lib/mongodb";
import Workflow from "@/models/Workflow";
import { withAPIKey } from "@/lib/auth/withAPIKey";

// GET all workflows (external access)
export const GET = withAPIKey(async (req: Request, context: any) => {
  await connectDB();

  const workflows = await Workflow.find();

  return Response.json(workflows);
});
