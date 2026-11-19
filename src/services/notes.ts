import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { notes } from "../db/schema.js";

type NewNote = { title: string; content: string };

// Condição que restringe a nota ao seu dono
function ownedNote(id: string, userId: string) {
  return and(eq(notes.id, id), eq(notes.id_user, userId));
}

export async function createNote(userId: string, data: NewNote) {
  try {
    const [note] = await db
      .insert(notes)
      .values({ ...data, id_user: userId })
      .returning();
    return note;
  } catch (error) {
    console.error("Erro ao criar nota:", error);
    throw error;
  }
}

export async function listNotes(userId: string) {
  try {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.id_user, userId))
      .orderBy(desc(notes.id));
  } catch (error) {
    console.error("Erro ao listar notas:", error);
    throw error;
  }
}

// Retorna null quando a nota não existe ou não pertence ao usuário
export async function getNoteById(id: string, userId: string) {
  try {
    const [note] = await db
      .select()
      .from(notes)
      .where(ownedNote(id, userId));
    return note ?? null;
  } catch (error) {
    console.error("Erro ao buscar nota:", error);
    throw error;
  }
}

export async function updateNote(
  id: string,
  userId: string,
  data: Partial<NewNote>,
) {
  try {
    const [note] = await db
      .update(notes)
      .set(data)
      .where(ownedNote(id, userId))
      .returning();
    return note ?? null;
  } catch (error) {
    console.error("Erro ao atualizar nota:", error);
    throw error;
  }
}

export async function removeNote(id: string, userId: string) {
  try {
    const [note] = await db
      .delete(notes)
      .where(ownedNote(id, userId))
      .returning();
    return note ?? null;
  } catch (error) {
    console.error("Erro ao excluir nota:", error);
    throw error;
  }
}
