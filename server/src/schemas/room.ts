import { z } from 'zod';

export const createRoomSchema = z.object({
  playerName: z.string().trim().min(1, 'Le pseudo est requis.').max(20),
});

export const joinRoomSchema = z.object({
  code: z.string().trim().min(1, 'Le code est requis.').max(8),
  playerName: z.string().trim().min(1, 'Le pseudo est requis.').max(20),
});
