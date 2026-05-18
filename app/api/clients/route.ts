import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/lib/auth/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const clients = await User.find({ role: "client" }).sort({ createdAt: -1 });
    return NextResponse.json(clients);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Using better-auth's server API to safely hash password and create user in DB
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        // role is explicitly omitted here because better-auth blocks role assignment in public signUp
      },
      asResponse: true
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || "Failed to create user" }, { status: response.status });
    }

    const data = await response.json();

    // Explicitly set the role to "client" after creation using Mongoose
    await connectDB();
    await User.updateOne({ _id: data.user.id }, { $set: { role: "client" } });

    data.user.role = "client";

    return NextResponse.json({ success: true, user: data.user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create client" }, { status: 500 });
  }
}
