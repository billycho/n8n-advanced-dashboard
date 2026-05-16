import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";
import "@/models/AIAgent";
import "@/models/Workflow";
import { withAuth } from "@/lib/auth/withAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    await connectDB();

    const activities = await Activity.find({})
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
