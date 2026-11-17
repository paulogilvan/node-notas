import express from "express";
import type { NextFunction, Request, Response } from "express";
import { env } from "./env.js";
import { router } from "./routes/main.js";

const app = express();

app.use(express.json());
app.use(router);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Erros não tratados (ex.: JSON malformado)
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(env.PORT, () => {
  console.log(`Servidor rodando na porta ${env.PORT}`);
});
