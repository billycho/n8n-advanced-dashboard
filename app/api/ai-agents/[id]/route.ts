import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

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
    console.error("UPDATE AGENT ERROR:", error); // ✅ debugging

    return Response.json(
      { error: error.message || "Failed to update AI Agent" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params; // ✅ fix

    const agent = await AIAgent.findByIdAndDelete(id);

    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("DELETE AGENT ERROR:", error); // ✅ helpful debug

    return Response.json(
      { error: error.message || "Failed to delete AI Agent" },
      { status: 500 }
    );
  }
}
