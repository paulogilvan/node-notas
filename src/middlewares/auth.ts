import type { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.js";

// Extrai o token do header "Authorization: Bearer <token>"
function getBearerToken(req: Request) {
  const [scheme, token] = req.headers.authorization?.split(" ") ?? [];
  return scheme === "Bearer" && token ? token : null;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const userId = await authService.validateToken(token);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    req.userId = userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
