import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/withAuth";

export const POST = withAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    session: any
  ) => {
    const { id } = await params;

    const res = await fetch(
      `${process.env.N8N_API_URL}/workflows/${id}/deactivate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-N8N-API-KEY": process.env.N8N_API_KEY!,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to deactivate workflow" },
        { status: res.status }
      );
    }

    try {
      const data = await res.json();
      return NextResponse.json(data);
    } catch (e) {
      // n8n might return empty response for some actions
      return NextResponse.json({ success: true });
    }
  }
);
