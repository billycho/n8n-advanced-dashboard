import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";
import AIAgent from "@/models/AIAgent";
import Workflow from "@/models/Workflow";
import { withAuth } from "@/lib/auth/withAuth";
import { NextRequest, NextResponse } from "next/server";

export const POST = withAuth(async (req: NextRequest) => {
  try {
    await connectDB();
    const { executions } = await req.json();

    if (!executions || !Array.isArray(executions)) {
      return NextResponse.json({ error: "Invalid executions data" }, { status: 400 });
    }

    const results = [];

    for (const exec of executions) {
      // Check if already exists by n8n execution id
      const existing = await Activity.findOne({ id: String(exec.id) });
      if (existing) {
        results.push({ id: exec.id, status: "skipped" });
        continue;
      }

      // Find AIAgent or Workflow by workflowId
      const agent = await AIAgent.findOne({ workflow_id: String(exec.workflowId) });
      const workflow = await Workflow.findOne({ workflow_id: String(exec.workflowId) });

      const newActivity = await Activity.create({
        id: String(exec.id),
        finished: exec.finished,
        mode: exec.mode,
        status: exec.status,
        startedAt: exec.startedAt,
        stoppedAt: exec.stoppedAt,
        workflowId: String(exec.workflowId),
        ai_agent: agent?._id,
        workflow: workflow?._id,
        data: exec.data,
        activity_json: exec,
      });

      results.push({ id: exec.id, status: "created", _id: newActivity._id });
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Failed to sync activities:", error);
    return NextResponse.json({ error: error.message || "Failed to sync activities" }, { status: 500 });
  }
});
