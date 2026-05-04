import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";
import { withAPIKey } from "@/lib/auth/withAPIKey";

export const POST = withAPIKey(async (req: Request) => {
  try {
    await connectDB();

    const body = await req.json();

    const { agent, report_date, report_status, report_summary, error_details, metadata } = body;

    if (!agent || !report_status || !report_summary) {
      return Response.json(
        { error: "Missing required fields: agent, report_status, report_summary" },
        { status: 400 }
      );
    }

    const report = await Report.create({
      agent,
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
