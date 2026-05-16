import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";
import "@/models/AIAgent";
import "@/models/Workflow";
import { withAuth } from "@/lib/auth/withAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    const { id } = await params;

    const activity = await Activity.findById(id)
      .populate("ai_agent", "name category environment description model slug webhook_url")
      .populate("workflow", "name category environment description triggerType active form_url");

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    return NextResponse.json(activity);
  } catch (error: any) {
    console.error("Failed to fetch activity:", error);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
});
