import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent"; // Ensure AIAgent is registered
import Report from "@/models/Report";
import { withAuth } from "@/lib/auth/withAuth";

export const GET = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;

    const report = await Report.findById(id).populate("agent").populate("workflow");

    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    return Response.json(report);
  } catch (error) {
    console.error(`Failed to fetch report:`, error);
    return Response.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
});
