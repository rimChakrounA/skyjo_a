import type { PrismaClient } from '@prisma/client';

export interface FinishedGamePlayerInput {
  playerId: string;
  name: string;
  score: number;
  /** Identifiant du compte utilisateur (null pour les invités). */
  userId?: string | null;
}

export interface FinishedGameInput {
  code: string;
  rounds: number;
  winnerId: string;
  winnerName: string;
  players: FinishedGamePlayerInput[];
}

/** Persiste une partie terminée avec les liens utilisateurs si disponibles. */
export function saveFinishedGame(prisma: PrismaClient, data: FinishedGameInput) {
  return prisma.finishedGame.create({
    data: {
      code: data.code,
      rounds: data.rounds,
      winnerId: data.winnerId,
      winnerName: data.winnerName,
      players: {
        create: data.players.map((player) => ({
          playerId: player.playerId,
          name: player.name,
          score: player.score,
          userId: player.userId ?? null,
        })),
      },
    },
    include: { players: true },
  });
}

/** Récupère une partie terminée par son identifiant. */
export function findFinishedGame(prisma: PrismaClient, id: string) {
  return prisma.finishedGame.findUnique({
    where: { id },
    include: { players: true },
  });
}

/** Récupère les parties d'un utilisateur authentifié. */
export function findGamesByUser(prisma: PrismaClient, userId: string) {
  return prisma.finishedGamePlayer.findMany({
    where: { userId },
    include: { game: { include: { players: true } } },
    orderBy: { game: { createdAt: 'desc' } },
  });
}

/** Calcule les statistiques d'un utilisateur. */
export async function getUserStats(
  prisma: PrismaClient,
  userId: string,
): Promise<{ played: number; wins: number; avgScore: number; bestScore: number }> {
  const players = await prisma.finishedGamePlayer.findMany({
    where: { userId },
    include: { game: true },
  });

  if (players.length === 0) {
    return { played: 0, wins: 0, avgScore: 0, bestScore: 0 };
  }

  const wins = players.filter((p) => p.game.winnerId === p.playerId).length;
  const scores = players.map((p) => p.score);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const bestScore = Math.min(...scores);

  return { played: players.length, wins, avgScore, bestScore };
}
