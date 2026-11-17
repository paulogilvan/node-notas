import { desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { notes } from "../db/schema.js";

type NewNote = { title: string; content: string };

export async function createNote(data: NewNote) {
  try {
    const [note] = await db.insert(notes).values(data).returning();
    return note;
  } catch (error) {
    console.error("Erro ao criar nota:", error);
    throw error;
  }
}

export async function listNotes() {
  try {
    return await db.select().from(notes).orderBy(desc(notes.id));
  } catch (error) {
    console.error("Erro ao listar notas:", error);
    throw error;
  }
}

// Retorna null quando a nota não existe
export async function getNoteById(id: string) {
  try {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note ?? null;
  } catch (error) {
    console.error("Erro ao buscar nota:", error);
    throw error;
  }
}

export async function updateNote(id: string, data: Partial<NewNote>) {
  try {
    const [note] = await db
      .update(notes)
      .set(data)
      .where(eq(notes.id, id))
      .returning();
    return note ?? null;
  } catch (error) {
    console.error("Erro ao atualizar nota:", error);
    throw error;
  }
}

export async function removeNote(id: string) {
  try {
    const [note] = await db.delete(notes).where(eq(notes.id, id)).returning();
    return note ?? null;
  } catch (error) {
    console.error("Erro ao excluir nota:", error);
    throw error;
  }
}
