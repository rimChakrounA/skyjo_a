import { z } from 'zod';
import { MAX_PLAYERS, MIN_PLAYERS } from '@shared/constants/game.js';

export const createRoomSchema = z
  .object({
    playerName: z.string().trim().min(1, 'Le pseudo est requis.').max(20),
    minPlayers: z.number().int().min(MIN_PLAYERS).max(MAX_PLAYERS).optional(),
    maxPlayers: z.number().int().min(MIN_PLAYERS).max(MAX_PLAYERS).optional(),
  })
  .refine(
    (data) => {
      const min = data.minPlayers ?? MIN_PLAYERS;
      const max = data.maxPlayers ?? MAX_PLAYERS;
      return min <= max;
    },
    { message: 'Le minimum ne peut pas dépasser le maximum.' },
  );

export const joinRoomSchema = z.object({
  code: z.string().trim().min(1, 'Le code est requis.').max(8),
  playerName: z.string().trim().min(1, 'Le pseudo est requis.').max(20),
});
