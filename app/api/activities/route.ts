import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";
import UserWorkflowPermission from "@/models/UserWorkflowPermission";
import "@/models/AIAgent";
import "@/models/Workflow";
import { withAuth } from "@/lib/auth/withAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(async (req: NextRequest, context: any, session: any) => {
  try {
    await connectDB();

    // Default: only display activities that have a registered AI Agent or Workflow
    let query: any = {
      $or: [
        { ai_agent: { $exists: true, $ne: null } },
        { workflow: { $exists: true, $ne: null } }
      ]
    };

    // Client-specific permission filtering
    if (session?.user?.role === "client") {
      const permissions = await UserWorkflowPermission.find({ user: session.user.id });
      
      const assignedAgentIds = permissions.map(p => p.ai_agent).filter(Boolean);
      const assignedWorkflowIds = permissions.map(p => p.workflow).filter(Boolean);

      query = {
        $and: [
          query,
          {
            $or: [
              { ai_agent: { $in: assignedAgentIds } },
              { workflow: { $in: assignedWorkflowIds } }
            ]
          }
        ]
      };
    }

    const activities = await Activity.find(query)
      .populate("ai_agent", "name category environment")
      .populate("workflow", "name category environment")
      .sort({ startedAt: -1 })
      .limit(50); // Limit to last 50 for performance

    return NextResponse.json(activities);
  } catch (error: any) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
});
