import { db, pool } from "./index.js";
import { notes } from "./schema.js";

async function seed() {
  await db.insert(notes).values([
    { title: "Compras", content: "Leite, pão e café" },
    { title: "Estudos", content: "Revisar Node.js e Drizzle" },
    { title: "Ideias", content: "Criar um app de notas" },
    { title: "Reunião", content: "Alinhar entregas da semana" },
  ]);
  console.log("Seed concluído");
}

seed()
  .catch((error) => {
    console.error("Erro no seed:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
