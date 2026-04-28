import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    const agent = await AIAgent.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );

    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    return Response.json(agent);
  } catch (error) {
    return Response.json(
      { error: "Failed to update AI Agent" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const agent = await AIAgent.findByIdAndDelete(params.id);

    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to delete AI Agent" },
      { status: 500 }
    );
  }
}
