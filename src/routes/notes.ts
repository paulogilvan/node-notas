import { Router } from "express";
import * as notesController from "../controllers/notes.js";
import { authMiddleware } from "../middlewares/auth.js";

export const notesRouter = Router();

// Todas as rotas de notas exigem autenticação
notesRouter.use(authMiddleware);

notesRouter.post("/", notesController.create);
notesRouter.get("/", notesController.list);
notesRouter.get("/:id", notesController.getById);
notesRouter.put("/:id", notesController.update);
notesRouter.delete("/:id", notesController.remove);
