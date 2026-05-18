import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserWorkflowPermission from "@/models/UserWorkflowPermission";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; permissionId: string }> }
) {
  try {
    await connectDB();
    const { permissionId } = await params;
    
    await UserWorkflowPermission.findByIdAndDelete(permissionId);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
