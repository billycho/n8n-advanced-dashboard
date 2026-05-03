import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/withAuth";

// GET workflow
export const GET = withAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    session: any
  ) => {
    const { id } = await params;

    const res = await fetch(
      `${process.env.N8N_API_URL}/workflows/${id}?excludePinnedData=true`,
      {
        headers: {
          "X-N8N-API-KEY": process.env.N8N_API_KEY!,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch workflow" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  }
);

// UPDATE workflow
export const PUT = withAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
    session: any
  ) => {
    const { id } = await params;
    const body = await req.json();

    const res = await fetch(
      `${process.env.N8N_API_URL}/workflows/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-N8N-API-KEY": process.env.N8N_API_KEY!,
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to update workflow" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  }
);