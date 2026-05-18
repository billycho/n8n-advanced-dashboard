import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";
import UserWorkflowPermission from "@/models/UserWorkflowPermission";
import "@/models/AIAgent";
import "@/models/Workflow";
import { withAuth } from "@/lib/auth/withAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }, session: any) => {
  try {
    await connectDB();
    const { id } = await params;

    const activity = await Activity.findById(id)
      .populate("ai_agent", "name category environment description model slug webhook_url")
      .populate("workflow", "name category environment description triggerType active form_url");

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    if (session?.user?.role === "client") {
      const hasPermission = await UserWorkflowPermission.findOne({
        user: session.user.id,
        $or: [
          { ai_agent: activity.ai_agent?._id },
          { workflow: activity.workflow?._id }
        ]
      });
      if (!hasPermission) {
        return NextResponse.json({ error: "Unauthorized access to this activity" }, { status: 403 });
      }
    }

    return NextResponse.json(activity);
  } catch (error: any) {
    console.error("Failed to fetch activity:", error);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
});
