import type { NextFunction, Request, Response } from 'express';
import { findFinishedGame } from '../repositories/finishedGameRepository.js';
import { prisma } from '../repositories/prismaClient.js';

/** Récupère une partie terminée par son identifiant. */
export async function getGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const game = await findFinishedGame(prisma, req.params.id ?? '');
    if (game === null) {
      res.status(404).json({ error: 'Partie introuvable.' });
      return;
    }
    res.status(200).json(game);
  } catch (err) {
    next(err);
  }
}
