import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent";
import UserWorkflowPermission from "@/models/UserWorkflowPermission";
import { withAuth } from "@/lib/auth/withAuth";

// GET single agent
export const GET = withAuth(
  async (
    req: Request,
    { params }: { params: Promise<{ id: string }> },
    session: any
  ) => {
    try {
      await connectDB();

      const { id } = await params;

      if (session?.user?.role === "client") {
        const hasPermission = await UserWorkflowPermission.findOne({
          user: session.user.id,
          ai_agent: id
        });
        if (!hasPermission) {
          return Response.json({ error: "Unauthorized access to this AI Agent" }, { status: 403 });
        }
      }

      const agent = await AIAgent.findById(id);

      if (!agent) {
        return Response.json({ error: "Agent not found" }, { status: 404 });
      }

      return Response.json(agent);
    } catch (error: any) {
      return Response.json(
        { error: error.message || "Failed to fetch AI Agent" },
        { status: 500 }
      );
    }
  }
);

// UPDATE agent
export const PUT = withAuth(
  async (
    req: Request,
    { params }: { params: Promise<{ id: string }> },
    session: any
  ) => {
    try {
      await connectDB();

      if (session?.user?.role === "client") {
        return Response.json({ error: "Unauthorized: Clients cannot modify AI Agents" }, { status: 403 });
      }

      const { id } = await params;
      const body = await req.json();

      const agent = await AIAgent.findByIdAndUpdate(
        id,
        { $set: body },
        { returnDocument: "after" }
      );

      if (!agent) {
        return Response.json({ error: "Agent not found" }, { status: 404 });
      }

      return Response.json(agent);
    } catch (error: any) {
      console.error("UPDATE AGENT ERROR:", error);

      return Response.json(
        { error: error.message || "Failed to update AI Agent" },
        { status: 500 }
      );
    }
  }
);

// DELETE agent
export const DELETE = withAuth(
  async (
    req: Request,
    { params }: { params: Promise<{ id: string }> },
    session: any
  ) => {
    try {
      await connectDB();

      if (session?.user?.role === "client") {
        return Response.json({ error: "Unauthorized: Clients cannot delete AI Agents" }, { status: 403 });
      }

      const { id } = await params;

      const agent = await AIAgent.findByIdAndDelete(id);

      if (!agent) {
        return Response.json({ error: "Agent not found" }, { status: 404 });
      }

      return Response.json({ success: true });
    } catch (error: any) {
      console.error("DELETE AGENT ERROR:", error);

      return Response.json(
        { error: error.message || "Failed to delete AI Agent" },
        { status: 500 }
      );
    }
  }
);