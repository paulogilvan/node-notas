import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db, pool } from "./index.js";
import { notes, users } from "./schema.js";

const SEED_USER = { email: "seed@example.com", password: "123456" };

// Reaproveita o usuário do seed se já existir, para o seed poder rodar mais de uma vez
async function getOrCreateSeedUser() {
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, SEED_USER.email));
  if (existing) return existing;

  const password = await bcrypt.hash(SEED_USER.password, 10);
  const [user] = await db
    .insert(users)
    .values({ email: SEED_USER.email, password })
    .returning({ id: users.id });
  return user!;
}

async function seed() {
  const { id: id_user } = await getOrCreateSeedUser();

  await db.insert(notes).values([
    { title: "Compras", content: "Leite, pão e café", id_user },
    { title: "Estudos", content: "Revisar Node.js e Drizzle", id_user },
    { title: "Ideias", content: "Criar um app de notas", id_user },
    { title: "Reunião", content: "Alinhar entregas da semana", id_user },
  ]);
  console.log(`Seed concluído (usuário: ${SEED_USER.email} / ${SEED_USER.password})`);
}

seed()
  .catch((error) => {
    console.error("Erro no seed:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
