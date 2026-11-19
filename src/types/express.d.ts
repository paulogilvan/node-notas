// Adiciona o id do usuário autenticado (preenchido pelo authMiddleware) ao Request
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
