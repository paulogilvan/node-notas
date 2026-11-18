import type { Request, Response } from "express";
import { ZodError } from "zod";
import { loginBodySchema, registerBodySchema } from "../schemas/auth.js";
import * as authService from "../services/auth.js";

function handleError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json({ error: "Validation error", issues: error.issues });
  }
  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
}

export async function register(req: Request, res: Response) {
  try {
    const body = registerBodySchema.parse(req.body);
    const user = await authService.registerUser(body);
    if (!user) return res.status(409).json({ error: "Email already in use" });
    res.status(201).json(user);
  } catch (error) {
    handleError(error, res);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const body = loginBodySchema.parse(req.body);
    const result = await authService.loginUser(body);
    if (!result) return res.status(401).json({ error: "Invalid credentials" });
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
}
