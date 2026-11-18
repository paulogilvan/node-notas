import { Router } from "express";
import * as notesController from "../controllers/notes.js";
import { authRouter } from "./auth.js";

export const router = Router();

router.use("/auth", authRouter);

router.post("/notes", notesController.create);
router.get("/notes", notesController.list);
router.get("/notes/:id", notesController.getById);
router.put("/notes/:id", notesController.update);
router.delete("/notes/:id", notesController.remove);
