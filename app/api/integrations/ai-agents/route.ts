import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent";
import { withAPIKey } from "@/lib/auth/withAPIKey";

// GET all agents (external access)
export const GET = withAPIKey(async (req: Request, context: any) => {
  await connectDB();

  const agents = await AIAgent.find();

  return Response.json(agents);
});