import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { loginSchema, registerSchema } from '../schemas/auth.js';
import { createUser, findUserByUsername } from '../repositories/userRepository.js';
import { prisma } from '../repositories/prismaClient.js';
import { signToken } from '../middleware/auth.js';

const BCRYPT_ROUNDS = 10;

/** POST /api/auth/register */
export async function register(req: Request, res: Response): Promise<void> {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0]?.message ?? 'Données invalides.' });
    return;
  }
  const { username, password } = result.data;

  const existing = await findUserByUsername(prisma, username);
  if (existing !== null) {
    res.status(409).json({ error: 'Ce pseudo est déjà pris.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await createUser(prisma, { username, passwordHash });
  const token = signToken({ userId: user.id, username: user.username });

  res.status(201).json({ token, user: { id: user.id, username: user.username } });
}

/** POST /api/auth/login */
export async function login(req: Request, res: Response): Promise<void> {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0]?.message ?? 'Données invalides.' });
    return;
  }
  const { username, password } = result.data;

  const user = await findUserByUsername(prisma, username);
  if (user === null) {
    res.status(401).json({ error: 'Pseudo ou mot de passe incorrect.' });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Pseudo ou mot de passe incorrect.' });
    return;
  }

  const token = signToken({ userId: user.id, username: user.username });
  res.json({ token, user: { id: user.id, username: user.username } });
}

/** GET /api/auth/me */
export function me(req: Request, res: Response): void {
  if (req.user === undefined) {
    res.status(401).json({ error: 'Non authentifié.' });
    return;
  }
  res.json({ user: { id: req.user.userId, username: req.user.username } });
}
