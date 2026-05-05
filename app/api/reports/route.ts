import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent"; // Ensure AIAgent is registered
import Report from "@/models/Report";
import { withAuth } from "@/lib/auth/withAuth";

export const GET = withAuth(async (req: Request) => {
  try {
    await connectDB();

    // Get query params for filtering by agent if needed
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");

    const query = agentId ? { agent: agentId } : {};

    const reports = await Report.find(query)
      .populate("agent", "name description category environment")
      .sort({ report_date: -1 });

    return Response.json(reports);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return Response.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
});
