import type { PrismaClient } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import {
  findFinishedGame,
  saveFinishedGame,
} from '../src/repositories/finishedGameRepository.js';

function fakePrisma() {
  const create = vi.fn().mockResolvedValue({ id: 'g1' });
  const findUnique = vi.fn().mockResolvedValue({ id: 'g1', players: [] });
  const prisma = { finishedGame: { create, findUnique } } as unknown as PrismaClient;
  return { prisma, create, findUnique };
}

describe('finishedGameRepository', () => {
  it('enregistre une partie terminée avec ses joueurs', async () => {
    const { prisma, create } = fakePrisma();
    await saveFinishedGame(prisma, {
      code: 'ABCDE',
      rounds: 3,
      winnerId: 'p1',
      winnerName: 'Alice',
      players: [{ playerId: 'p1', name: 'Alice', score: 20 }],
    });

    expect(create).toHaveBeenCalledOnce();
    const arg = create.mock.calls[0]?.[0] as {
      data: { code: string; players: { create: unknown[] } };
    };
    expect(arg.data.code).toBe('ABCDE');
    expect(arg.data.players.create).toHaveLength(1);
  });

  it('recherche une partie par identifiant', async () => {
    const { prisma, findUnique } = fakePrisma();
    await findFinishedGame(prisma, 'g1');
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 'g1' }, include: { players: true } });
  });
});
