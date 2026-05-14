import { connectDB } from "@/lib/mongodb";
import Workflow from "@/models/Workflow";
import { withAuth } from "@/lib/auth/withAuth";

// GET single workflow
export const GET = withAuth(
  async (
    req: Request,
    { params }: { params: Promise<{ id: string }> },
    session: any
  ) => {
    try {
      await connectDB();

      const { id } = await params;
      const workflow = await Workflow.findById(id);

      if (!workflow) {
        return Response.json({ error: "Workflow not found" }, { status: 404 });
      }

      return Response.json(workflow);
    } catch (error: any) {
      return Response.json(
        { error: error.message || "Failed to fetch Workflow" },
        { status: 500 }
      );
    }
  }
);

// UPDATE workflow
export const PUT = withAuth(
  async (
    req: Request,
    { params }: { params: Promise<{ id: string }> },
    session: any
  ) => {
    try {
      await connectDB();

      const { id } = await params;
      const body = await req.json();

      const workflow = await Workflow.findByIdAndUpdate(
        id,
        { $set: body },
        { returnDocument: "after" }
      );

      if (!workflow) {
        return Response.json({ error: "Workflow not found" }, { status: 404 });
      }

      return Response.json(workflow);
    } catch (error: any) {
      console.error("UPDATE WORKFLOW ERROR:", error);

      return Response.json(
        { error: error.message || "Failed to update Workflow" },
        { status: 500 }
      );
    }
  }
);

// DELETE workflow
export const DELETE = withAuth(
  async (
    req: Request,
    { params }: { params: Promise<{ id: string }> },
    session: any
  ) => {
    try {
      await connectDB();

      const { id } = await params;

      const workflow = await Workflow.findByIdAndDelete(id);

      if (!workflow) {
        return Response.json({ error: "Workflow not found" }, { status: 404 });
      }

      return Response.json({ success: true });
    } catch (error: any) {
      console.error("DELETE WORKFLOW ERROR:", error);

      return Response.json(
        { error: error.message || "Failed to delete Workflow" },
        { status: 500 }
      );
    }
  }
);
