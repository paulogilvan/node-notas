import { Router } from "express";
import { authRouter } from "./auth.js";
import { notesRouter } from "./notes.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/notes", notesRouter);
