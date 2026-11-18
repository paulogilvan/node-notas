import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

const SALT_ROUNDS = 10;
const DUMMY_HASH = bcrypt.hashSync("dummy", SALT_ROUNDS);

type NewUser = { email: string; password: string };
type Credentials = { email: string; password: string };

// Retorna null quando o e-mail já está cadastrado
export async function registerUser({ email, password }: NewUser) {
  try {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));
    if (existing) return null;

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const [user] = await db
      .insert(users)
      .values({ email, password: hash })
      .returning({ id: users.id, email: users.email });
    return user;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    throw error;
  }
}

// Retorna null quando e-mail ou senha são inválidos (sem distinguir qual)
export async function loginUser({ email, password }: Credentials) {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    // Compara sempre, mesmo sem usuário, para não revelar se o e-mail existe pelo tempo de resposta
    const valid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
    if (!user || !valid) return null;

    const token = randomBytes(32).toString("hex");
    await db.update(users).set({ token }).where(eq(users.id, user.id));
    return { id: user.id, token };
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}
