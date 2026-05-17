import { connectDB } from "@/lib/mongodb";
import AIAgent from "@/models/AIAgent"; // Ensure AIAgent is registered
import Workflow from "@/models/Workflow"; // Ensure Workflow is registered
import Report from "@/models/Report";
import { withAPIKey } from "@/lib/auth/withAPIKey";

export const POST = withAPIKey(async (req: Request) => {
  try {
    await connectDB();

    const body = await req.json();

    const { agent, workflow, report_date, report_status, report_summary, error_details, metadata } = body;

    if ((!agent && !workflow) || !report_status || !report_summary) {
      return Response.json(
        { error: "Missing required fields: agent or workflow, report_status, report_summary" },
        { status: 400 }
      );
    }

    const report = await Report.create({
      agent,
      workflow,
      report_date: report_date || new Date(),
      report_status,
      report_summary,
      error_details,
      metadata,
    });

    return Response.json(report, { status: 201 });
  } catch (error) {
    console.error("Failed to create report:", error);
    return Response.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
});
