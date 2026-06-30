import type { Request, Response } from 'express';
import { findGamesByUser, getUserStats } from '../repositories/finishedGameRepository.js';
import { prisma } from '../repositories/prismaClient.js';

/** GET /api/users/me/games — historique des parties de l'utilisateur connecté. */
export async function myGames(req: Request, res: Response): Promise<void> {
  if (req.user === undefined) {
    res.status(401).json({ error: 'Non authentifié.' });
    return;
  }
  const gamePlayers = await findGamesByUser(prisma, req.user.userId);
  const games = gamePlayers.map((gp) => ({
    id: gp.game.id,
    code: gp.game.code,
    rounds: gp.game.rounds,
    winnerId: gp.game.winnerId,
    winnerName: gp.game.winnerName,
    createdAt: gp.game.createdAt,
    myScore: gp.score,
    won: gp.game.winnerId === gp.playerId,
    players: gp.game.players.map((p) => ({ name: p.name, score: p.score })),
  }));
  res.json({ games });
}

/** GET /api/users/me/stats — statistiques de l'utilisateur connecté. */
export async function myStats(req: Request, res: Response): Promise<void> {
  if (req.user === undefined) {
    res.status(401).json({ error: 'Non authentifié.' });
    return;
  }
  const stats = await getUserStats(prisma, req.user.userId);
  res.json({ stats });
}
