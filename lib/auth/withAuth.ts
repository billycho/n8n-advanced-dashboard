// lib/auth/withAuth.ts
import { getSession } from "@/lib/auth/auth";

export function withAuth(handler: Function) {
  return async (req: Request, context?: any) => {
    const session = await getSession();

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // pass session into your handler
    return handler(req, context, session);
  };
}