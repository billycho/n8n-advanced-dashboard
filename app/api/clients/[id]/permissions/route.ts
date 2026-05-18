import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserWorkflowPermission from "@/models/UserWorkflowPermission";
import Workflow from "@/models/Workflow"; // Register model for populate
import AIAgent from "@/models/AIAgent"; // Register model for populate
import { getSession } from "@/lib/auth/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const permissions = await UserWorkflowPermission.find({ user: id })
      .populate("workflow")
      .populate("ai_agent")
      .sort({ createdAt: -1 });
      
    return NextResponse.json(permissions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const session = await getSession();
    
    const body = await req.json();
    const { workflowId, aiAgentId } = body;
    
    if (!workflowId && !aiAgentId) {
      return NextResponse.json({ error: "Either workflowId or aiAgentId is required" }, { status: 400 });
    }
    
    const query: any = { user: id };
    if (workflowId) query.workflow = workflowId;
    if (aiAgentId) query.ai_agent = aiAgentId;
    
    const existing = await UserWorkflowPermission.findOne(query);
    if (existing) {
      return NextResponse.json({ error: "Permission already assigned" }, { status: 400 });
    }
    
    const permission = await UserWorkflowPermission.create({
      user: id,
      workflow: workflowId || undefined,
      ai_agent: aiAgentId || undefined,
      assignedBy: session?.user?.id || "system",
    });
    
    const populated = await UserWorkflowPermission.findById(permission._id)
      .populate("workflow")
      .populate("ai_agent");
      
    return NextResponse.json(populated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    await UserWorkflowPermission.deleteMany({ user: id });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
