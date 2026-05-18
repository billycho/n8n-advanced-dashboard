import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent"; // Ensure AIAgent is registered
import Workflow from "@/models/Workflow"; // Ensure Workflow is registered
import Report from "@/models/Report";
import UserWorkflowPermission from "@/models/UserWorkflowPermission";
import { withAuth } from "@/lib/auth/withAuth";

export const GET = withAuth(async (req: Request, context: any, session: any) => {
  try {
    await connectDB();

    // Get query params for filtering by agent if needed
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");

    let query: any = agentId ? { agent: agentId } : {};

    if (session?.user?.role === "client") {
      const permissions = await UserWorkflowPermission.find({ user: session.user.id });
      
      const assignedAgentIds = permissions.map(p => p.ai_agent).filter(Boolean);
      const assignedWorkflowIds = permissions.map(p => p.workflow).filter(Boolean);

      const clientQuery = {
        $or: [
          { agent: { $in: assignedAgentIds } },
          { workflow: { $in: assignedWorkflowIds } }
        ]
      };

      if (agentId) {
        query = {
          $and: [
            { agent: agentId },
            clientQuery
          ]
        };
      } else {
        query = clientQuery;
      }
    }

    const reports = await Report.find(query)
      .populate("agent", "name description category environment")
      .populate("workflow", "name description triggerType environment")
      .sort({ report_date: -1 });

    return Response.json(reports);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return Response.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
});
