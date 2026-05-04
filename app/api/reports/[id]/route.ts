import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";
import AIAgent from "@/models/AIAgent";
import { withAuth } from "@/lib/auth/withAuth";

export const GET = withAuth(async (req: Request, { params }: { params: { id: string } }) => {
  try {
    await connectDB();

    const { id } = await params;

    const report = await Report.findById(id).populate("agent");

    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    return Response.json(report);
  } catch (error) {
    console.error(`Failed to fetch report ${params.id}:`, error);
    return Response.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
});
