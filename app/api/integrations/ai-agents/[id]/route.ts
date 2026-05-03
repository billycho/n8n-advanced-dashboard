import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent";
import { withAPIKey } from "@/lib/auth/withAPIKey";

export const GET = withAPIKey(
  async (
    req: Request,
    { params }: { params: { id: string } }
  ) => {
    await connectDB();

    const { id } = params;

    const agent = await AIAgent.findById(id);

    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    return Response.json(agent);
  }
);