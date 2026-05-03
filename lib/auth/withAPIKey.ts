export function withAPIKey(handler: Function) {
  return async (req: Request, context?: any) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || authHeader !== `Bearer ${process.env.EXTERNAL_API_KEY}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req, context);
  };
}