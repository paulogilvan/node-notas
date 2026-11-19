import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  createNoteBodySchema,
  idParamsSchema,
  listNotesQuerySchema,
  updateNoteBodySchema,
} from "../schemas/notes.js";
import * as notesService from "../services/notes.js";

function handleError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json({ error: "Validation error", issues: error.issues });
  }
  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
}

// O authMiddleware garante que req.userId está preenchido nas rotas de notas
function getUserId(req: Request) {
  if (!req.userId) throw new Error("req.userId ausente: rota sem authMiddleware");
  return req.userId;
}

export async function create(req: Request, res: Response) {
  try {
    const body = createNoteBodySchema.parse(req.body);
    const note = await notesService.createNote(getUserId(req), body);
    res.status(201).json(note);
  } catch (error) {
    handleError(error, res);
  }
}

export async function list(req: Request, res: Response) {
  try {
    listNotesQuerySchema.parse(req.query);
    const notes = await notesService.listNotes(getUserId(req));
    res.json(notes);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const { id } = idParamsSchema.parse(req.params);
    const note = await notesService.getNoteById(id, getUserId(req));
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (error) {
    handleError(error, res);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = idParamsSchema.parse(req.params);
    const body = updateNoteBodySchema.parse(req.body);
    const note = await notesService.updateNote(id, getUserId(req), body);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (error) {
    handleError(error, res);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = idParamsSchema.parse(req.params);
    const note = await notesService.removeNote(id, getUserId(req));
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
}
