import type { PrismaClient } from '@prisma/client';

export interface FinishedGamePlayerInput {
  playerId: string;
  name: string;
  score: number;
}

export interface FinishedGameInput {
  code: string;
  rounds: number;
  winnerId: string;
  winnerName: string;
  players: FinishedGamePlayerInput[];
}

/** Persiste une partie terminée (et uniquement terminée). */
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
