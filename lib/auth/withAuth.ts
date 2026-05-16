// lib/auth/withAuth.ts

import { getSession } from "@/lib/auth/auth";

export function withAuth(handler: Function) {
  return async (req: Request, context?: any) => {
    try {
      // =========================
      // API KEY BYPASS (DEV)
      // =========================
      const authHeader = req.headers.get("authorization");

      const isValidAPIKey =
        authHeader === `Bearer ${process.env.EXTERNAL_API_KEY}`;

      // If API key valid → bypass session auth
      if (isValidAPIKey) {
        return handler(req, context, {
          user: {
            id: "dev-api-key",
            role: "developer",
            authType: "api-key",
          },
        });
      }

      // =========================
      // NORMAL SESSION AUTH
      // =========================
      const session = await getSession();

      if (!session?.user) {
        return Response.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      // pass session into handler
      return handler(req, context, session);
    } catch (error) {
      return Response.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}