import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/withAuth";

// GET executions list from n8n
export const GET = withAuth(
  async (
    req: NextRequest,
    { params }: any,
    session: any
  ) => {
    const { searchParams } = new URL(req.url);

    // Set defaults: limit 10, includeData true
    const limit = searchParams.get("limit") || "10";
    const includeData = searchParams.get("includeData") || "true";

    // Build the n8n API URL
    // N8N_API_URL should include the base path like https://n8n.example.com/api/v1
    const n8nUrl = new URL(`${process.env.N8N_API_URL}/executions`);
    n8nUrl.searchParams.set("limit", limit);
    n8nUrl.searchParams.set("includeData", includeData);

    // Pass through other parameters (e.g. cursor, status)
    searchParams.forEach((value, key) => {
      if (key !== "limit" && key !== "includeData") {
        n8nUrl.searchParams.set(key, value);
      }
    });

    const res = await fetch(n8nUrl.toString(), {
      headers: {
        "X-N8N-API-KEY": process.env.N8N_API_KEY!,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch executions from n8n" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  }
);