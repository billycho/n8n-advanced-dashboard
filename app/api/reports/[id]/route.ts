import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent"; // Ensure AIAgent is registered
import Workflow from "@/models/Workflow"; // Ensure Workflow is registered
import Report from "@/models/Report";
import UserWorkflowPermission from "@/models/UserWorkflowPermission";
import { withAuth } from "@/lib/auth/withAuth";

export const GET = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }, session: any) => {
  try {
    await connectDB();

    const { id } = await params;

    const report = await Report.findById(id).populate("agent").populate("workflow");

    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    if (session?.user?.role === "client") {
      const hasPermission = await UserWorkflowPermission.findOne({
        user: session.user.id,
        $or: [
          { ai_agent: report.agent?._id },
          { workflow: report.workflow?._id }
        ]
      });
      if (!hasPermission) {
        return Response.json({ error: "Unauthorized access to this report" }, { status: 403 });
      }
    }

    return Response.json(report);
  } catch (error) {
    console.error(`Failed to fetch report:`, error);
    return Response.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
});
